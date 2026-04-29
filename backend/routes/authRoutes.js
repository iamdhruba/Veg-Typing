const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateStats,
  syncProgress,
  grantAchievement,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validation');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

router.post('/register', authLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);
router.get('/me', protect, getMe);
router.put('/stats', protect, updateStats);
router.put('/progress', protect, syncProgress);
router.post('/achievements', protect, grantAchievement);

module.exports = router;
