import api from './api';

export const getTodayDiet = () => api.get('/api/diet/today');
export const getWeeklyDiet = () => api.get('/api/diet/weekly');
export const logMeal = (data) => api.post('/api/diet', data);
export const deleteMeal = (id) => api.delete(`/api/diet/${id}`);
export const updateDietTargets = (data) => api.put('/api/diet/targets', data);
