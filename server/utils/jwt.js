const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

/**
 * Sign a JWT token with user id and role
 * @param {string} id - User UUID
 * @param {string} role - 'user' or 'admin'
 * @returns {string} JWT token
 */
const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {object} Decoded payload { id, role, iat, exp }
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { signToken, verifyToken };
