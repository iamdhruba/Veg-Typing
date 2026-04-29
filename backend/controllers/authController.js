const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // Validate username
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ message: 'Username must be 3-20 characters' });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Update user stats (from typing test)
// @route   PUT /api/auth/stats
// @access  Private
const updateStats = async (req, res) => {
  const { wpm, accuracy, language } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    user.totalTests += 1;
    
    if (!user.personalBests[language] || wpm > user.personalBests[language].wpm) {
      user.personalBests[language] = { wpm, accuracy };
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Sync curriculum progress
// @route   PUT /api/auth/progress
// @access  Private
const syncProgress = async (req, res) => {
  const { xp, streak, lastPracticeDate, progress } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.xp = xp || user.xp;
    user.streak = streak || user.streak;
    user.lastPracticeDate = lastPracticeDate || user.lastPracticeDate;
    
    if (progress) {
      // Merge progress
      Object.entries(progress).forEach(([mode, modeData]) => {
        if (!user.curriculumProgress.has(mode)) {
          user.curriculumProgress.set(mode, new Map());
        }
        const userModeMap = user.curriculumProgress.get(mode);
        Object.entries(modeData).forEach(([levelId, levelData]) => {
          userModeMap.set(levelId, levelData);
        });
      });
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Grant an achievement
// @route   POST /api/auth/achievements
// @access  Private
const grantAchievement = async (req, res) => {
  const { achievementId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    // Check if user already has it
    const hasAchievement = user.achievements.some(a => a.id === achievementId);
    if (!hasAchievement) {
      user.achievements.push({ id: achievementId });
      const updatedUser = await user.save();
      return res.json(updatedUser);
    }
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateStats,
  syncProgress,
  grantAchievement,
};
