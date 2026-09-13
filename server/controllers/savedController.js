const asyncHandler = require('express-async-handler');
const SavedItem = require('../models/SavedItem');

// @desc    Save an item
// @route   POST /api/saved
// @access  Private
const saveItem = asyncHandler(async (req, res) => {
  const { itemType, itemId, itemName, itemImage } = req.body;
  if (!itemType || !itemId || !itemName) {
    res.status(400);
    throw new Error('itemType, itemId and itemName are required');
  }

  const existing = await SavedItem.findOne({ user: req.user._id, itemType, itemId });
  if (existing) {
    res.status(200).json({ success: true, data: existing, message: 'Already saved' });
    return;
  }

  const saved = await SavedItem.create({ user: req.user._id, itemType, itemId, itemName, itemImage });
  res.status(201).json({ success: true, data: saved });
});

// @desc    Get all saved items for user
// @route   GET /api/saved
// @access  Private
const getSavedItems = asyncHandler(async (req, res) => {
  const { itemType } = req.query;
  const query = { user: req.user._id };
  if (itemType) query.itemType = itemType;
  const items = await SavedItem.find(query).sort({ createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});

// @desc    Remove a saved item
// @route   DELETE /api/saved/:id
// @access  Private
const removeSavedItem = asyncHandler(async (req, res) => {
  const item = await SavedItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Saved item not found');
  }
  if (item.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  await item.deleteOne();
  res.json({ success: true, message: 'Removed from saved' });
});

module.exports = { saveItem, getSavedItems, removeSavedItem };
