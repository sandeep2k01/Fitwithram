const supabase = require('../config/supabase');

/**
 * Get workouts for a specific plan
 */
const getWorkoutsByPlan = async (planId) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('plan_id', planId)
    .order('created_at', { ascending: true });

  if (error) throw { statusCode: 500, message: 'Failed to fetch workouts.' };
  return data;
};

/**
 * Create a new workout (admin only)
 */
const createWorkout = async ({ plan_id, title, description, duration }) => {
  const { data, error } = await supabase
    .from('workouts')
    .insert({ plan_id, title, description, duration })
    .select()
    .single();

  if (error) throw { statusCode: 500, message: 'Failed to create workout.' };
  return data;
};

module.exports = { getWorkoutsByPlan, createWorkout };
