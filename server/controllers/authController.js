const authService = require('../services/authService');
const { success, error } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { name, email, password, goal } = req.body;

    if (!name || !email || !password) {
      return error(res, 'Name, email, and password are required.', 400);
    }

    if (password.length < 6) {
      return error(res, 'Password must be at least 6 characters.', 400);
    }

    const result = await authService.register({ name, email, password, goal });
    return success(res, result, 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Email and password are required.', 400);
    }

    const result = await authService.login({ email, password });
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = authService.getProfile(req.user);
    return success(res, { user });
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { register, login, getProfile };
