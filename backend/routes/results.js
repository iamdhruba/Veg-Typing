const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const Result = require('../models/Result');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware').protect;
const { resultValidation } = require('../middleware/validation');
const logger = require('../config/logger');

// Rate limiter for result submission
const resultLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 results per minute
  message: 'Too many test submissions, please slow down'
});

// @route   POST /api/results
// @desc    Save a typing test result
// @access  Private
router.post('/', auth, resultLimiter, resultValidation, async (req, res) => {
  const { language, mode, duration, wpm, accuracy, wpmHistory, charData } = req.body;
  logger.info('POST /api/results body:', { language, mode, duration, wpm, accuracy });

  // Validate result data
  if (!language || duration == null || wpm == null || accuracy == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (wpm < 0 || wpm > 500) {
    return res.status(400).json({ message: 'Invalid WPM value' });
  }
  if (accuracy < 0 || accuracy > 100) {
    return res.status(400).json({ message: 'Invalid accuracy value' });
  }
  if (!['english', 'preeti', 'romanized', 'unicode'].includes(language)) {
    return res.status(400).json({ message: 'Invalid language' });
  }

  try {
    const newResult = new Result({
      userId: req.user.id,
      language,
      mode: mode || 'time',
      duration,
      wpm,
      accuracy,
      wpmHistory: wpmHistory || [],
      charData: charData || {},
    });

    const result = await newResult.save();
    logger.info('Result saved successfully:', { resultId: result._id, userId: req.user.id });

    // Update user personal bests atomically
    const user = await User.findById(req.user.id);
    if (user) {
      const pb = user.personalBests?.[language];
      const updateData = { $inc: { totalTests: 1 } };
      if (!pb || wpm > pb.wpm) {
        updateData.$set = { [`personalBests.${language}`]: { wpm, accuracy } };
      }
      await User.updateOne({ _id: req.user.id }, updateData);
    }

    res.json(result);
  } catch (err) {
    logger.error('Error saving result:', { 
      message: err.message, 
      stack: err.stack, 
      name: err.name,
      userId: req.user?.id,
      body: req.body
    });
    res.status(500).json({ message: err.message || 'Server Error', error: err.toString() });
  }
});

// @route   GET /api/results/me
// @desc    Get user's results with pagination
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    logger.info('GET /api/results/me - userId:', req.user.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    const [results, total] = await Promise.all([
      Result.find({ userId: req.user.id })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Result.countDocuments({ userId: req.user.id })
    ]);

    logger.info('Found results:', { count: results.length, total });

    res.json({
      results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + results.length < total
      }
    });
  } catch (err) {
    logger.error('Error fetching user results:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/results/me
// @desc    Wipe user's results
// @access  Private
router.delete('/me', auth, async (req, res) => {
  try {
    await Result.deleteMany({ userId: req.user.id });
    
    // Reset user stats
    const user = await User.findById(req.user.id);
    if (user) {
      user.totalTests = 0;
      user.personalBests = {
        english: { wpm: 0, accuracy: 0 },
        preeti: { wpm: 0, accuracy: 0 },
        romanized: { wpm: 0, accuracy: 0 },
        unicode: { wpm: 0, accuracy: 0 }
      };
      await user.save();
    }
    
    res.json({ message: 'Data wiped successfully' });
  } catch (err) {
    logger.error('Error wiping user data:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
