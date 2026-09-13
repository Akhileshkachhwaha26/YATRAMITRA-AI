const express = require('express');
const { planTrip, recommend, chat } = require('../controllers/aiController');

const router = express.Router();

router.post('/plan-trip', planTrip);
router.post('/recommend', recommend);
router.post('/chat', chat);

module.exports = router;
