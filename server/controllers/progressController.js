const progressService = require('../services/progressService');
const { success, error } = require('../utils/response');

const logProgress = async (req, res) => {
  try {
    const { workout_id, status, date, notes } = req.body;

    if (!workout_id || !status || !date) {
      return error(res, 'workout_id, status, and date are required.', 400);
    }

    const progress = await progressService.logProgress({
      user_id: req.user.id,
      workout_id,
      status,
      date,
      notes,
    });
    return success(res, { progress }, 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Users can only see their own progress (unless admin)
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return error(res, 'Access denied.', 403);
    }

    const progress = await progressService.getProgressByUser(userId);
    const streak = await progressService.getStreak(userId);

    return success(res, { progress, streak });
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { logProgress, getProgress };
