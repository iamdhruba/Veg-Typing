const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const mongoose = require('mongoose');

// @route   GET /api/leaderboard
// @desc    Get global leaderboard with timeframes and user grouping
// @access  Public
router.get('/', async (req, res) => {
  const { language = 'english', duration = 30, timeframe = 'alltime' } = req.query;
  
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
    // Use aggregation to group by user and get their best WPM
    const leaderboard = await Result.aggregate([
      { $match: matchQuery },
      { $sort: { wpm: -1 } },
      { $group: {
          _id: "$userId",
          bestWpm: { $max: "$wpm" },
          doc: { $first: "$$ROOT" } // Keep the document with the highest WPM
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
      { $limit: 50 }
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
