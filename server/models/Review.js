const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    itemType: { type: String, enum: ['destination', 'hotel', 'experience', 'business'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, maxlength: 1000, trim: true },
  },
  { timestamps: true }
);

// One review per user per item
reviewSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });
// Fast lookup of all reviews for a given item
reviewSchema.index({ itemType: 1, itemId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
