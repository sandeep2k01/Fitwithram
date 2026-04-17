const supabase = require('../config/supabase');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

/**
 * Register a new user
 */
const register = async ({ name, email, password, goal }) => {
  // Check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existing) {
    throw { statusCode: 400, message: 'User with this email already exists.' };
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Insert user
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      goal: goal || 'strength',
    })
    .select('id, name, email, role, goal, is_paid, created_at')
    .single();

  if (error) {
    console.error('Supabase Insert Error:', error);
    throw { statusCode: 500, message: 'Failed to create user.' };
  }

  const token = signToken(user.id, user.role);

  return { token, user };
};

/**
 * Login user
 */
const login = async ({ email, password }) => {
  // Find user by email (include password for comparison)
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !user) {
    throw { statusCode: 401, message: 'Invalid email or password.' };
  }

  // Compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid email or password.' };
  }

  const token = signToken(user.id, user.role);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

/**
 * Get user profile (already fetched by auth middleware)
 */
const getProfile = (user) => {
  return user;
};

module.exports = { register, login, getProfile };
