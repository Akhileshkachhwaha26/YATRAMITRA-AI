const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['guide', 'restaurant', 'homestay', 'shop', 'transport', 'experience-host', 'artisan'],
      required: true,
    },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    destinationName: { type: String, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    contact: {
      phone: String,
      email: String,
    },
    languagesSpoken: [{ type: String }],
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'suspended'], default: 'approved' },
    inquiries: [
      {
        name: String,
        email: String,
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    analytics: {
      views: { type: Number, default: 0 },
      inquiriesCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', businessSchema);
