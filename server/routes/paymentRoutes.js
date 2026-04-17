const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const { RAZORPAY_KEY_ID } = require('../config/env');

const router = express.Router();

router.post('/create-order', auth, createOrder);
router.post('/verify', auth, verifyPayment);
router.get('/key', auth, (req, res) => res.status(200).json({ key: RAZORPAY_KEY_ID }));

module.exports = router;
