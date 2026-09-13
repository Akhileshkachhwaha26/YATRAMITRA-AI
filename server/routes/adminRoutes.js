const express = require('express');
const { getStats, listUsers, listAllBusinesses, updateBusinessStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/stats', getStats);
router.get('/users', listUsers);
router.get('/businesses', listAllBusinesses);
router.put('/businesses/:id/status', updateBusinessStatus);

module.exports = router;
