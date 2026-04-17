import api from './api';

export const getWorkoutsByPlan = (planId) => api.get(`/api/workouts/${planId}`);
export const createWorkout = (data) => api.post('/api/workouts', data);
export const getMyWorkouts = () => api.get('/api/workouts/my-workouts');
