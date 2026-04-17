import api from './api';

export const createPaymentOrder = (data) => api.post('/api/payment/create-order', data);
export const verifyPayment = (data) => api.post('/api/payment/verify', data);
export const getRazorpayKey = () => api.get('/api/payment/key');
