const supabase = require('../config/supabase');
const { success, error } = require('../utils/response');

const getAllUsers = async (req, res) => {
  try {
    const { data: users, error: dbError } = await supabase
      .from('users')
      .select('id, name, email, role, goal, is_paid, created_at')
      .eq('role', 'user')
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;

    return success(res, { users });
  } catch (err) {
    return error(res, err.message || 'Failed to fetch users.', 500);
  }
};

const getStats = async (req, res) => {
  try {
    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user');

    // By goal
    const { count: strengthCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')
      .eq('goal', 'strength');

    const { count: cardioCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')
      .eq('goal', 'cardio');

    const { count: hiitCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')
      .eq('goal', 'hiit');

    // Paid vs Unpaid
    const { count: paidCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')
      .eq('is_paid', true);

    // Total revenue from successful payments
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'success');

    const totalRevenue = (payments || []).reduce((sum, p) => sum + p.amount, 0);

    // Active subscriptions (paid users)
    const { count: activeSubscriptions } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')
      .eq('is_paid', true);

    return success(res, {
      totalUsers: totalUsers || 0,
      strengthCount: strengthCount || 0,
      cardioCount: cardioCount || 0,
      hiitCount: hiitCount || 0,
      paidCount: paidCount || 0,
      unpaidCount: (totalUsers || 0) - (paidCount || 0),
      totalRevenue,
      activeSubscriptions: activeSubscriptions || 0,
    });
  } catch (err) {
    return error(res, err.message || 'Failed to fetch stats.', 500);
  }
};

const getAllPayments = async (req, res) => {
  try {
    const { data: payments, error: dbError } = await supabase
      .from('payments')
      .select('id, amount, status, created_at, razorpay_order_id, user_id, users(name, email)')
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;

    return success(res, { payments });
  } catch (err) {
    return error(res, err.message || 'Failed to fetch payments.', 500);
  }
};

module.exports = { getAllUsers, getStats, getAllPayments };
