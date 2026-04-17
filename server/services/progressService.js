const supabase = require('../config/supabase');

/**
 * Log a workout progress entry
 */
const logProgress = async ({ user_id, workout_id, status, date, notes }) => {
  const { data, error } = await supabase
    .from('progress')
    .insert({ user_id, workout_id, status, date, notes })
    .select()
    .single();

  if (error) throw { statusCode: 500, message: 'Failed to log progress.' };
  return data;
};

/**
 * Get progress for a user
 */
const getProgressByUser = async (userId) => {
  const { data, error } = await supabase
    .from('progress')
    .select(`
      *,
      workouts (title, duration, plan_id)
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw { statusCode: 500, message: 'Failed to fetch progress.' };
  return data;
};

/**
 * Get streak (consecutive days with completed workouts)
 */
const getStreak = async (userId) => {
  const { data, error } = await supabase
    .from('progress')
    .select('date')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('date', { ascending: false });

  if (error) return 0;

  if (!data || data.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique dates
  const uniqueDates = [...new Set(data.map(d => d.date))].sort().reverse();

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = expectedDate.toISOString().split('T')[0];

    if (uniqueDates[i] === expected) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

module.exports = { logProgress, getProgressByUser, getStreak };
