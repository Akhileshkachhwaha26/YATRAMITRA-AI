const express = require('express');
const { saveItem, getSavedItems, removeSavedItem } = require('../controllers/savedController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', saveItem);
router.get('/', getSavedItems);
router.delete('/:id', removeSavedItem);

module.exports = router;
