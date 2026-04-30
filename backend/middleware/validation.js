const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

const resultValidation = [
  body('language')
    .isIn(['english', 'preeti', 'unicode', 'romanized'])
    .withMessage('Invalid language'),
  body('wpm')
    .isFloat({ min: 0, max: 500 })
    .withMessage('WPM must be between 0 and 500'),
  body('accuracy')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Accuracy must be between 0 and 100'),
  body('duration')
    .isFloat({ min: 0, max: 300 })
    .withMessage('Duration must be between 0 and 300 seconds'),
  (req, res, next) => validate(req, res, next)
];

module.exports = {
  registerValidation,
  loginValidation,
  resultValidation,
  validate
};
