import api from './api';

export const getPlans = () => api.get('/api/plans');
export const getPlanById = (id) => api.get(`/api/plans/${id}`);
