const express = require('express');
const router = express.Router();
const TimeLog = require('../models/TimeLog');

// GET productivity analytics for a date range
router.get('/productivity', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'startDate and endDate are required'
      });
    }
    
    const analytics = await TimeLog.aggregate([
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
          sessions: { $sum: 1 },
          productiveSessions: {
            $sum: { $cond: ['$isProductive', 1, 0] }
          },
          unproductiveSessions: {
            $sum: { $cond: ['$isProductive', 0, 1] }
          }
        }
      },
      {
        $addFields: {
          productivityScore: {
            $cond: [
              { $eq: ['$totalTime', 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: ['$productiveTime', '$totalTime']
                  },
                  100
                ]
              }
            ]
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Calculate overall summary
    const summary = analytics.reduce((acc, day) => {
      acc.totalTime += day.totalTime;
      acc.productiveTime += day.productiveTime;
      acc.unproductiveTime += day.unproductiveTime;
      acc.totalSessions += day.sessions;
      acc.productiveSessions += day.productiveSessions;
      acc.unproductiveSessions += day.unproductiveSessions;
      return acc;
    }, {
      totalTime: 0,
      productiveTime: 0,
      unproductiveTime: 0,
      totalSessions: 0,
      productiveSessions: 0,
      unproductiveSessions: 0
    });
    
    summary.productivityScore = summary.totalTime > 0 
      ? (summary.productiveTime / summary.totalTime) * 100 
      : 0;
    
    res.json({
      summary,
      dailyData: analytics
    });
  } catch (error) {
    console.error('Error fetching productivity analytics:', error);
    res.status(500).json({ error: 'Failed to fetch productivity analytics' });
  }
});

// GET domain analytics
router.get('/domains', async (req, res) => {
  try {
    const { startDate, endDate, limit = 20 } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'startDate and endDate are required'
      });
    }
    
    const domainAnalytics = await TimeLog.aggregate([
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
          _id: '$domain',
          totalTime: { $sum: '$duration' },
          sessions: { $sum: 1 },
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
          avgSessionDuration: { $avg: '$duration' }
        }
      },
      {
        $addFields: {
          productivityScore: {
            $cond: [
              { $eq: ['$totalTime', 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: ['$productiveTime', '$totalTime']
                  },
                  100
                ]
              }
            ]
          }
        }
      },
      { $sort: { totalTime: -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    res.json(domainAnalytics);
  } catch (error) {
    console.error('Error fetching domain analytics:', error);
    res.status(500).json({ error: 'Failed to fetch domain analytics' });
  }
});

// GET hourly activity pattern
router.get('/hourly-pattern', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'startDate and endDate are required'
      });
    }
    
    const hourlyPattern = await TimeLog.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $addFields: {
          hour: { $hour: '$timestamp' }
        }
      },
      {
        $group: {
          _id: '$hour',
          totalTime: { $sum: '$duration' },
          sessions: { $sum: 1 },
          productiveTime: {
            $sum: {
              $cond: ['$isProductive', '$duration', 0]
            }
          },
          unproductiveTime: {
            $sum: {
              $cond: ['$isProductive', 0, '$duration']
            }
          }
        }
      },
      {
        $addFields: {
          productivityScore: {
            $cond: [
              { $eq: ['$totalTime', 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: ['$productiveTime', '$totalTime']
                  },
                  100
                ]
              }
            ]
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(hourlyPattern);
  } catch (error) {
    console.error('Error fetching hourly pattern:', error);
    res.status(500).json({ error: 'Failed to fetch hourly pattern' });
  }
});

// GET weekly comparison
router.get('/weekly-comparison', async (req, res) => {
  try {
    const { weeks = 4 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));
    
    const weeklyData = await TimeLog.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $addFields: {
          weekStart: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: {
                  year: { $year: '$timestamp' },
                  week: { $week: '$timestamp' },
                  dayOfWeek: 1
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: '$weekStart',
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
      {
        $addFields: {
          productivityScore: {
            $cond: [
              { $eq: ['$totalTime', 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: ['$productiveTime', '$totalTime']
                  },
                  100
                ]
              }
            ]
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(weeklyData);
  } catch (error) {
    console.error('Error fetching weekly comparison:', error);
    res.status(500).json({ error: 'Failed to fetch weekly comparison' });
  }
});

// GET productivity insights
router.get('/insights', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'startDate and endDate are required'
      });
    }
    
    // Get overall productivity data
    const overallData = await TimeLog.aggregate([
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
          avgSessionDuration: { $avg: '$duration' }
        }
      }
    ]);
    
    // Get most productive domains
    const mostProductiveDomains = await TimeLog.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate
          },
          isProductive: true
        }
      },
      {
        $group: {
          _id: '$domain',
          totalTime: { $sum: '$duration' },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { totalTime: -1 } },
      { $limit: 5 }
    ]);
    
    // Get most distracting domains
    const mostDistractingDomains = await TimeLog.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate
          },
          isProductive: false
        }
      },
      {
        $group: {
          _id: '$domain',
          totalTime: { $sum: '$duration' },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { totalTime: -1 } },
      { $limit: 5 }
    ]);
    
    const data = overallData[0] || {
      totalTime: 0,
      productiveTime: 0,
      unproductiveTime: 0,
      totalSessions: 0,
      avgSessionDuration: 0
    };
    
    const productivityScore = data.totalTime > 0 
      ? (data.productiveTime / data.totalTime) * 100 
      : 0;
    
    const insights = {
      summary: {
        ...data,
        productivityScore: Math.round(productivityScore * 100) / 100
      },
      mostProductiveDomains,
      mostDistractingDomains,
      recommendations: this.generateRecommendations(data, productivityScore)
    };
    
    res.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// Helper function to generate recommendations
function generateRecommendations(data, productivityScore) {
  const recommendations = [];
  
  if (productivityScore < 50) {
    recommendations.push({
      type: 'warning',
      message: 'Your productivity score is below 50%. Consider reducing time on distracting websites.',
      priority: 'high'
    });
  }
  
  if (data.avgSessionDuration > 1800000) { // 30 minutes
    recommendations.push({
      type: 'info',
      message: 'Your average session duration is quite long. Consider taking more frequent breaks.',
      priority: 'medium'
    });
  }
  
  if (data.totalSessions > 100) {
    recommendations.push({
      type: 'info',
      message: 'You have many short sessions. Consider focusing on longer, uninterrupted work periods.',
      priority: 'medium'
    });
  }
  
  if (productivityScore > 80) {
    recommendations.push({
      type: 'success',
      message: 'Great job! Your productivity score is excellent. Keep up the good work!',
      priority: 'low'
    });
  }
  
  return recommendations;
}

module.exports = router; 