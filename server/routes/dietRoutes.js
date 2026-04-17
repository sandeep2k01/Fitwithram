const express = require('express');
const { getTodayDiet, logMeal, deleteMeal, updateTargets, getWeeklyDiet } = require('../controllers/dietController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/today', auth, getTodayDiet);
router.get('/weekly', auth, getWeeklyDiet);
router.post('/', auth, logMeal);
router.delete('/:id', auth, deleteMeal);
router.put('/targets', auth, updateTargets);

module.exports = router;
