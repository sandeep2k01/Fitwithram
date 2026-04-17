import api from './api';

export const getAdminUsers = () => api.get('/api/admin/users');
export const getAdminStats = () => api.get('/api/admin/stats');
export const getAdminPayments = () => api.get('/api/admin/payments');
