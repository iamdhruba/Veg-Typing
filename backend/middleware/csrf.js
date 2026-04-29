const crypto = require('crypto');

// Simple CSRF token generation and validation
const csrfTokens = new Map(); // In production, use Redis

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'];
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const storedToken = csrfTokens.get(userId);

  if (!token || token !== storedToken) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  next();
};

const getToken = (req, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = generateToken();
  csrfTokens.set(userId, token);

  // Auto-cleanup after 1 hour
  setTimeout(() => csrfTokens.delete(userId), 3600000);

  res.json({ csrfToken: token });
};

module.exports = { csrfProtection, getToken };
