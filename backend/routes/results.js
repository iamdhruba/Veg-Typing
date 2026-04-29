const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware').protect;
const { resultValidation } = require('../middleware/validation');
const logger = require('../config/logger');

// @route   POST /api/results
// @desc    Save a typing test result
// @access  Private
router.post('/', auth, resultValidation, async (req, res) => {
  const { language, mode, duration, wpm, accuracy, wpmHistory, charData } = req.body;

  // Validate result data
  if (!language || !duration || wpm == null || accuracy == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (wpm < 0 || wpm > 350) {
    return res.status(400).json({ message: 'Invalid WPM value' });
  }
  if (accuracy < 0 || accuracy > 100) {
    return res.status(400).json({ message: 'Invalid accuracy value' });
  }
  if (!['english', 'preeti', 'romanized', 'unicode'].includes(language)) {
    return res.status(400).json({ message: 'Invalid language' });
  }

  // --- ANTI-CHEAT VALIDATION ---
  if (charData) {
    // 1 WPM = 5 chars per minute
    const totalTypedChars = Object.values(charData).reduce((acc, curr) => acc + curr.correct + curr.incorrect, 0);
    const expectedChars = (wpm * 5) * (duration / 60);
    
    // If they claim high WPM but typed very few characters (allow 20% margin of error for backspaces)
    if (totalTypedChars > 0 && expectedChars > (totalTypedChars * 1.5)) {
      return res.status(403).json({ message: 'Anti-cheat triggered: WPM does not match typed character count.' });
    }
  }

  try {
    const newResult = new Result({
      userId: req.user.id,
      language,
      mode,
      duration,
      wpm,
      accuracy,
      wpmHistory,
      charData,
    });

    const result = await newResult.save();

    // Update user personal bests
    const user = await User.findById(req.user.id);
    if (user) {
      user.totalTests += 1;
      if (!user.personalBests[language] || wpm > user.personalBests[language].wpm) {
        user.personalBests[language] = { wpm, accuracy };
      }
      await user.save();
    }

    res.json(result);
  } catch (err) {
    logger.error('Error saving result:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/results/me
// @desc    Get user's results with pagination
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
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
