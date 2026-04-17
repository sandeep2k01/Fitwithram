/**
 * Global Error Handler Middleware
 * Catches unhandled errors and returns consistent response
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔴 Server Error:', err.message);
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
};

module.exports = errorHandler;
