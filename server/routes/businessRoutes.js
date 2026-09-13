const express = require('express');
const {
  getBusinesses,
  getBusinessById,
  createBusiness,
  getMyBusinesses,
  updateBusiness,
  deleteBusiness,
  submitInquiry,
} = require('../controllers/businessController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getBusinesses);
router.get('/mine', protect, authorize('provider', 'admin'), getMyBusinesses);
router.post('/', protect, authorize('provider', 'admin'), createBusiness);
router.get('/:id', getBusinessById);
router.put('/:id', protect, authorize('provider', 'admin'), updateBusiness);
router.delete('/:id', protect, authorize('provider', 'admin'), deleteBusiness);
router.post('/:id/inquiries', submitInquiry);

module.exports = router;
