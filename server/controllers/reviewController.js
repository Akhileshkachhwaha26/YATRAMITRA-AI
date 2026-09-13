const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const Experience = require('../models/Experience');
const Business = require('../models/Business');

const MODEL_MAP = { destination: Destination, hotel: Hotel, experience: Experience, business: Business };

/**
 * Recomputes an item's `rating` and `reviewCount` from its real reviews.
 * This is what makes ratings genuinely user-generated instead of the
 * static numbers in the seed data — every review write triggers this.
 * If the last review on an item is deleted, we leave `rating` as-is
 * (reverting to a seeded baseline would be misleading) and just zero
 * out `reviewCount`.
 */
async function recalculateRating(itemType, itemId) {
  const Model = MODEL_MAP[itemType];
  if (!Model) return;

  const [stats] = await Review.aggregate([
    { $match: { itemType, itemId: new mongoose.Types.ObjectId(itemId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (!stats || stats.count === 0) {
    await Model.findByIdAndUpdate(itemId, { reviewCount: 0 });
    return;
  }

  await Model.findByIdAndUpdate(itemId, {
    rating: Math.round(stats.avg * 10) / 10,
    reviewCount: stats.count,
  });
}

// @desc    Get reviews for an item
// @route   GET /api/reviews?itemType=&itemId=
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const { itemType, itemId, limit = 20 } = req.query;
  if (!itemType || !itemId) {
    res.status(400);
    throw new Error('itemType and itemId are required');
  }

  const reviews = await Review.find({ itemType, itemId })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10) || 20);

  const [summary] = await Review.aggregate([
    { $match: { itemType, itemId: new mongoose.Types.ObjectId(itemId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    count: reviews.length,
    averageRating: summary ? Math.round(summary.avg * 10) / 10 : null,
    totalReviews: summary?.count || 0,
    data: reviews,
  });
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { itemType, itemId, rating, comment } = req.body;

  if (!itemType || !itemId || !rating || !comment) {
    res.status(400);
    throw new Error('itemType, itemId, rating and comment are required');
  }
  if (!MODEL_MAP[itemType]) {
    res.status(400);
    throw new Error('Invalid itemType');
  }

  const existing = await Review.findOne({ user: req.user._id, itemType, itemId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this item — edit your existing review instead');
  }

  const review = await Review.create({
    user: req.user._id,
    userName: req.user.name,
    itemType,
    itemId,
    rating,
    comment,
  });

  await recalculateRating(itemType, itemId);
  res.status(201).json({ success: true, data: review });
});

// @desc    Update your own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  if (req.body.rating !== undefined) review.rating = req.body.rating;
  if (req.body.comment !== undefined) review.comment = req.body.comment;
  await review.save();

  await recalculateRating(review.itemType, review.itemId);
  res.json({ success: true, data: review });
});

// @desc    Delete your own review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  const { itemType, itemId } = review;
  await review.deleteOne();
  await recalculateRating(itemType, itemId);

  res.json({ success: true, message: 'Review deleted' });
});

// @desc    Get the logged-in user's own reviews (for "my reviews" UI)
// @route   GET /api/reviews/mine
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, data: reviews });
});

module.exports = { getReviews, createReview, updateReview, deleteReview, getMyReviews };
