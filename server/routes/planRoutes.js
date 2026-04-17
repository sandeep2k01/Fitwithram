const express = require('express');
const { getAllPlans, getPlanById } = require('../controllers/planController');

const router = express.Router();

router.get('/', getAllPlans);
router.get('/:id', getPlanById);

module.exports = router;
