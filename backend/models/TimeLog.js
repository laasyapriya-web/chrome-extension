const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  isProductive: {
    type: Boolean,
    required: true,
    default: false
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  date: {
    type: String,
    required: true,
    index: true
  },
  url: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
timeLogSchema.index({ date: 1, domain: 1 });
timeLogSchema.index({ date: 1, isProductive: 1 });
timeLogSchema.index({ timestamp: -1 });

// Virtual for formatted duration
timeLogSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 3600000);
  const minutes = Math.floor((this.duration % 3600000) / 60000);
  const seconds = Math.floor((this.duration % 60000) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
});

// Static method to get daily summary
timeLogSchema.statics.getDailySummary = async function(date) {
  const summary = await this.aggregate([
    { $match: { date: date } },
    {
      $group: {
        _id: null,
        totalTime: { $sum: '$duration' },
        productiveTime: {
          $sum: {
            $cond: ['$isProductive', '$duration', 0]
          }
        },
        unproductiveTime: {
          $sum: {
            $cond: ['$isProductive', 0, '$duration']
          }
        },
        totalSessions: { $sum: 1 },
        productiveSessions: {
          $sum: { $cond: ['$isProductive', 1, 0] }
        },
        unproductiveSessions: {
          $sum: { $cond: ['$isProductive', 0, 1] }
        }
      }
    }
  ]);
  
  return summary[0] || {
    totalTime: 0,
    productiveTime: 0,
    unproductiveTime: 0,
    totalSessions: 0,
    productiveSessions: 0,
    unproductiveSessions: 0
  };
};

// Static method to get weekly summary
timeLogSchema.statics.getWeeklySummary = async function(startDate, endDate) {
  const summary = await this.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$date',
        totalTime: { $sum: '$duration' },
        productiveTime: {
          $sum: {
            $cond: ['$isProductive', '$duration', 0]
          }
        },
        unproductiveTime: {
          $sum: {
            $cond: ['$isProductive', 0, '$duration']
          }
        },
        sessions: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  return summary;
};

// Static method to get top domains
timeLogSchema.statics.getTopDomains = async function(date, limit = 10) {
  const domains = await this.aggregate([
    { $match: { date: date } },
    {
      $group: {
        _id: '$domain',
        totalTime: { $sum: '$duration' },
        sessions: { $sum: 1 },
        isProductive: { $first: '$isProductive' }
      }
    },
    { $sort: { totalTime: -1 } },
    { $limit: limit }
  ]);
  
  return domains;
};

// Pre-save middleware to ensure date is set
timeLogSchema.pre('save', function(next) {
  if (!this.date) {
    this.date = new Date().toISOString().split('T')[0];
  }
  next();
});

module.exports = mongoose.model('TimeLog', timeLogSchema); 