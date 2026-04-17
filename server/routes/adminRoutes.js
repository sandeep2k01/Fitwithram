const express = require('express');
const { getAllUsers, getStats, getAllPayments } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/users', auth, admin, getAllUsers);
router.get('/stats', auth, admin, getStats);
router.get('/payments', auth, admin, getAllPayments);

module.exports = router;
