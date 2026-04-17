const paymentService = require('../services/paymentService');
const { success, error } = require('../utils/response');

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const result = await paymentService.createOrder(req.user.id, amount);
    return success(res, result);
  } catch (err) {
    // Force 500 so our frontend doesn't think the USER's token is invalid (401)
    return error(res, err.description || err.message || 'Razorpay Error', 500);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const result = await paymentService.verifyPayment(req.user.id, req.body);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { createOrder, verifyPayment };
