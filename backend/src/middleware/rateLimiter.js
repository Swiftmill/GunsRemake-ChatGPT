const rateLimit = require('express-rate-limit');

const createLimiter = (options = {}) => rateLimit({
  windowMs: options.windowMs || 60 * 1000,
  max: options.max || 100,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = createLimiter;
