const express = require('express');
const router = express.Router();
const TimeLog = require('../models/TimeLog');

// GET all time logs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const filters = {};
    
    // Date filter
    if (req.query.date) {
      filters.date = req.query.date;
    }
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filters.date = {
        $gte: req.query.startDate,
        $lte: req.query.endDate
      };
    }
    
    // Domain filter
    if (req.query.domain) {
      filters.domain = req.query.domain;
    }
    
    // Productivity filter
    if (req.query.isProductive !== undefined) {
      filters.isProductive = req.query.isProductive === 'true';
    }
    
    const timeLogs = await TimeLog.find(filters)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await TimeLog.countDocuments(filters);
    
    res.json({
      timeLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching time logs:', error);
    res.status(500).json({ error: 'Failed to fetch time logs' });
  }
});

// POST new time log
router.post('/', async (req, res) => {
  try {
    const { domain, duration, isProductive, url, title } = req.body;
    
    // Validation
    if (!domain || !duration || isProductive === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['domain', 'duration', 'isProductive']
      });
    }
    
    if (duration < 0) {
      return res.status(400).json({
        error: 'Duration must be a positive number'
      });
    }
    
    // Create new time log
    const timeLog = new TimeLog({
      domain: domain.toLowerCase(),
      duration,
      isProductive,
      url,
      title,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });
    
    await timeLog.save();
    
    res.status(201).json({
      message: 'Time log created successfully',
      timeLog
    });
  } catch (error) {
    console.error('Error creating time log:', error);
    res.status(500).json({ error: 'Failed to create time log' });
  }
});

// GET time log by ID
router.get('/:id', async (req, res) => {
  try {
    const timeLog = await TimeLog.findById(req.params.id);
    
    if (!timeLog) {
      return res.status(404).json({ error: 'Time log not found' });
    }
    
    res.json(timeLog);
  } catch (error) {
    console.error('Error fetching time log:', error);
    res.status(500).json({ error: 'Failed to fetch time log' });
  }
});

// PUT update time log
router.put('/:id', async (req, res) => {
  try {
    const { domain, duration, isProductive, url, title } = req.body;
    
    const updateData = {};
    if (domain) updateData.domain = domain.toLowerCase();
    if (duration !== undefined) updateData.duration = duration;
    if (isProductive !== undefined) updateData.isProductive = isProductive;
    if (url) updateData.url = url;
    if (title) updateData.title = title;
    
    const timeLog = await TimeLog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!timeLog) {
      return res.status(404).json({ error: 'Time log not found' });
    }
    
    res.json({
      message: 'Time log updated successfully',
      timeLog
    });
  } catch (error) {
    console.error('Error updating time log:', error);
    res.status(500).json({ error: 'Failed to update time log' });
  }
});

// DELETE time log
router.delete('/:id', async (req, res) => {
  try {
    const timeLog = await TimeLog.findByIdAndDelete(req.params.id);
    
    if (!timeLog) {
      return res.status(404).json({ error: 'Time log not found' });
    }
    
    res.json({
      message: 'Time log deleted successfully',
      timeLog
    });
  } catch (error) {
    console.error('Error deleting time log:', error);
    res.status(500).json({ error: 'Failed to delete time log' });
  }
});

// GET daily summary
router.get('/summary/daily/:date', async (req, res) => {
  try {
    const summary = await TimeLog.getDailySummary(req.params.date);
    res.json(summary);
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
});

// GET weekly summary
router.get('/summary/weekly', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'startDate and endDate are required'
      });
    }
    
    const summary = await TimeLog.getWeeklySummary(startDate, endDate);
    res.json(summary);
  } catch (error) {
    console.error('Error fetching weekly summary:', error);
    res.status(500).json({ error: 'Failed to fetch weekly summary' });
  }
});

// GET top domains for a date
router.get('/domains/top/:date', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const domains = await TimeLog.getTopDomains(req.params.date, limit);
    res.json(domains);
  } catch (error) {
    console.error('Error fetching top domains:', error);
    res.status(500).json({ error: 'Failed to fetch top domains' });
  }
});

// DELETE old logs (cleanup)
router.delete('/cleanup/old', async (req, res) => {
  try {
    const daysToKeep = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const result = await TimeLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });
    
    res.json({
      message: `Deleted ${result.deletedCount} old time logs`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up old logs:', error);
    res.status(500).json({ error: 'Failed to cleanup old logs' });
  }
});

module.exports = router; 