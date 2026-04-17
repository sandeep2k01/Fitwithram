const supabase = require('../config/supabase');

/**
 * Get all plans
 */
const getAllPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw { statusCode: 500, message: 'Failed to fetch plans.' };
  return data;
};

/**
 * Get a single plan by ID
 */
const getPlanById = async (id) => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw { statusCode: 404, message: 'Plan not found.' };
  return data;
};

module.exports = { getAllPlans, getPlanById };
