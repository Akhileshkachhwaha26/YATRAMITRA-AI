const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    destinationName: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, default: '' },
    rating: { type: Number, min: 0, max: 5, default: 4 },
    reviewCount: { type: Number, default: 0 },
    pricePerNightINR: { type: Number, required: true },
    priceTier: { type: String, enum: ['budget', 'moderate', 'premium', 'luxury'], default: 'moderate' },
    amenities: [{ type: String }],
    isEcoFriendly: { type: Boolean, default: false },
    isLocalBusiness: { type: Boolean, default: false },
    address: { type: String, default: '' },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null },
    // Architecture is ready for a real hotel-booking API; until integrated,
    // we never claim real-time availability.
    realTimeAvailabilityIntegrated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);
