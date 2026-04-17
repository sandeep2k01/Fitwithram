const workoutService = require('../services/workoutService');
const supabase = require('../config/supabase');
const { success, error } = require('../utils/response');

const getWorkoutsByPlan = async (req, res) => {
  try {
    const workouts = await workoutService.getWorkoutsByPlan(req.params.planId);
    return success(res, { workouts });
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const createWorkout = async (req, res) => {
  try {
    const { plan_id, title, description, duration } = req.body;

    if (!plan_id || !title) {
      return error(res, 'plan_id and title are required.', 400);
    }

    const workout = await workoutService.createWorkout({ plan_id, title, description, duration });
    return success(res, { workout }, 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getMyWorkouts = async (req, res) => {
  try {
    const { data: user } = await supabase.from('users').select('goal').eq('id', req.user.id).single();
    if (!user) return error(res, 'User not found', 404);
    
    const goalMap = { 'strength': 'Strength Training', 'cardio': 'Cardio', 'hiit': 'HIIT' };
    const planName = goalMap[user.goal];
    
    if (!planName) return error(res, 'Invalid user goal', 400);

    const { data: plan } = await supabase.from('plans').select('id, name, description').eq('name', planName).single();
    if (!plan) return error(res, 'Plan not found', 404);
    
    const { data: workouts, error: wError } = await supabase.from('workouts').select('*').eq('plan_id', plan.id).order('created_at');
    if (wError) throw wError;
    
    return success(res, { plan, workouts });
  } catch (err) {
    return error(res, err.message || 'Failed to fetch personal workouts', 500);
  }
};

module.exports = { getWorkoutsByPlan, createWorkout, getMyWorkouts };
