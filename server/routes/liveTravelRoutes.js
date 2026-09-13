const express = require('express');
const { getDestinationLive, getRouteToDestination } = require('../controllers/liveTravelController');
const router = express.Router();
router.get('/destination/:id', getDestinationLive);
router.get('/route/:id', getRouteToDestination);
module.exports = router;
