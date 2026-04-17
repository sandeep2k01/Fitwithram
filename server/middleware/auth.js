const { verifyToken } = require('../utils/jwt');
const supabase = require('../config/supabase');
const { error } = require('../utils/response');

/**
 * JWT Authentication Middleware
 * Extracts Bearer token, verifies it, attaches user to req.user
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Fetch user from Supabase (exclude password)
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('id, name, email, role, goal, is_paid, created_at')
      .eq('id', decoded.id)
      .single();

    if (dbError || !user) {
      return error(res, 'User not found. Invalid token.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token.', 401);
  }
};

module.exports = auth;
