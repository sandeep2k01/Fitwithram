const express = require('express');
const { getWorkoutsByPlan, createWorkout, getMyWorkouts } = require('../controllers/workoutController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/my-workouts', auth, getMyWorkouts);
router.get('/:planId', auth, getWorkoutsByPlan);
router.post('/', auth, admin, createWorkout);

module.exports = router;
