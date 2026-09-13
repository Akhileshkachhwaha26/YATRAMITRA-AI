const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'food-tour', 'handicrafts', 'cultural', 'village-tourism', 'trekking',
        'photography', 'festival', 'cooking-class', 'nature', 'wildlife', 'spiritual',
      ],
      required: true,
    },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    destinationName: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    priceINR: { type: Number, required: true },
    durationHours: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    host: { type: String, required: true },
    hostIsLocal: { type: Boolean, default: true },
    groupSize: { type: String, default: 'Up to 8 people' },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
