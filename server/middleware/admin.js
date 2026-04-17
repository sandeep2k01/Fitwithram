const { error } = require('../utils/response');

/**
 * Admin-only Middleware
 * Must be used AFTER auth middleware
 * Checks if req.user.role === 'admin'
 */
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return error(res, 'Access denied. Admin privileges required.', 403);
  }
  next();
};

module.exports = admin;
