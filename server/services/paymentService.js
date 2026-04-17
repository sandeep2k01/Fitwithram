const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../config/supabase');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env');

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 */
const createOrder = async (userId, amount) => {
  const options = {
    amount: (amount || 999) * 100, // paise
    currency: 'INR',
    receipt: `receipt_${userId}_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  // Save pending payment
  await supabase.from('payments').insert({
    user_id: userId,
    razorpay_order_id: order.id,
    amount: options.amount / 100,
    status: 'pending',
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
};

/**
 * Verify Razorpay payment signature
 */
const verifyPayment = async (userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    // Mark as failed
    await supabase
      .from('payments')
      .update({ status: 'failed' })
      .eq('razorpay_order_id', razorpay_order_id);

    throw { statusCode: 400, message: 'Payment verification failed.' };
  }

  // Mark as success
  await supabase
    .from('payments')
    .update({ razorpay_payment_id, status: 'success' })
    .eq('razorpay_order_id', razorpay_order_id);

  // Update user paid status
  await supabase
    .from('users')
    .update({ is_paid: true })
    .eq('id', userId);

  return { message: 'Payment verified successfully.' };
};

module.exports = { createOrder, verifyPayment };
