import api from './api';

export const logProgress = (data) => api.post('/api/progress', data);
export const getProgress = (userId) => api.get(`/api/progress/${userId}`);
