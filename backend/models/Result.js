const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  language: { 
    type: String, 
    enum: ['english', 'preeti', 'unicode'], 
    index: true 
  },
  mode: { 
    type: String, 
    enum: ['time', 'words'] 
  },
  duration: { 
    type: Number, 
    index: true 
  },
  wpm: { 
    type: Number, 
    index: true 
  },
  accuracy: { 
    type: Number 
  },
  wpmHistory: [Number],
  charData: {
    type: Map,
    of: {
      correct: { type: Number, default: 0 },
      incorrect: { type: Number, default: 0 }
    }
  },
  timestamp: { 
    type: Date, 
    default: Date.now, 
    index: true 
  },
});

// Compound index for leaderboard
ResultSchema.index({ language: 1, duration: 1, wpm: -1 });

module.exports = mongoose.model('Result', ResultSchema);
