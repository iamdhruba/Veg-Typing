const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const mongoose = require('mongoose');
const logger = require('../config/logger');

// @route   GET /api/leaderboard
// @desc    Get global leaderboard with pagination and timeframes
// @access  Public
router.get('/', async (req, res) => {
  const { 
    language = 'english', 
    duration = 30, 
    timeframe = 'alltime',
    page = 1,
    limit = 50 
  } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ message: 'Invalid pagination parameters' });
  }
  
  const matchQuery = { 
    language, 
    duration: parseInt(duration) 
  };

  const now = new Date();
  if (timeframe === 'daily') {
    matchQuery.timestamp = { $gte: new Date(now.setDate(now.getDate() - 1)) };
  } else if (timeframe === 'weekly') {
    matchQuery.timestamp = { $gte: new Date(now.setDate(now.getDate() - 7)) };
  }

  try {
    const leaderboard = await Result.aggregate([
      { $match: matchQuery },
      { $sort: { wpm: -1 } },
      { $group: {
          _id: "$userId",
          bestWpm: { $max: "$wpm" },
          doc: { $first: "$$ROOT" }
      }},
      { $replaceRoot: { newRoot: "$doc" } },
      { $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData'
      }},
      { $unwind: "$userData" },
      { $project: {
          _id: 1,
          wpm: 1,
          accuracy: 1,
          timestamp: 1,
          userId: {
            _id: "$userData._id",
            username: "$userData.username"
          }
      }},
      { $sort: { wpm: -1 } },
      { $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limitNum }]
      }}
    ]);

    const total = leaderboard[0].metadata[0]?.total || 0;
    const results = leaderboard[0].data;

    res.json({
      results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasMore: skip + results.length < total
      }
    });
  } catch (err) {
    logger.error('Error fetching leaderboard:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
