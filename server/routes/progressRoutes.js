const express = require('express');
const { logProgress, getProgress } = require('../controllers/progressController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, logProgress);
router.get('/:userId', auth, getProgress);

module.exports = router;
