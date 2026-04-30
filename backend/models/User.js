const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  personalBests: {
    english: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    preeti: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    unicode: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    romanized: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
  },
  totalTests: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastPracticeDate: { type: String }, // Store as YYYY-MM-DD
  curriculumProgress: {
    type: Map,
    of: {
      type: Map,
      of: {
        stars: { type: Number, default: 0 },
        bestWpm: { type: Number, default: 0 },
        completed: { type: Number, default: 0 }, // 0 or 1
      }
    },
    default: {
      english: {},
      preeti: {},
      unicode: {}
    }
  },
  achievements: [
    {
      id: { type: String },
      unlockedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(this.password, salt))
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => next(err));
});

module.exports = mongoose.model('User', UserSchema);
