/**
 * Standard success response
 * @param {object} res - Express response
 * @param {object} data - Response data
 * @param {number} statusCode - HTTP status (default 200)
 */
const success = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    ...data,
  });
};

/**
 * Standard error response
 * @param {object} res - Express response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status (default 500)
 */
const error = (res, message = 'Internal server error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { success, error };
