const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const logger = require('../config/logger');

// @route   GET /health
// @desc    Health check endpoint
// @access  Public
router.get('/', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: 'unknown',
      memory: 'unknown',
    }
  };

  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    healthCheck.checks.database = dbStatus[dbState] || 'unknown';

    // Check memory usage
    const memUsage = process.memoryUsage();
    healthCheck.checks.memory = {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    };

    // If database is not connected, return 503
    if (dbState !== 1) {
      logger.warn('Health check failed: Database not connected');
      return res.status(503).json(healthCheck);
    }

    res.status(200).json(healthCheck);
  } catch (error) {
    logger.error('Health check error:', error);
    healthCheck.message = 'ERROR';
    res.status(503).json(healthCheck);
  }
});

// @route   GET /health/ready
// @desc    Readiness check (for Kubernetes)
// @access  Public
router.get('/ready', (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// @route   GET /health/live
// @desc    Liveness check (for Kubernetes)
// @access  Public
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
