const mongoose = require('mongoose');

const dayPlanSchema = new mongoose.Schema(
  {
    day: Number,
    morning: { title: String, description: String, cost: Number },
    afternoon: { title: String, description: String, cost: Number },
    evening: { title: String, description: String, cost: Number },
    suggestedHotel: String,
    estimatedDistanceKm: Number,
    localTip: String,
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    destinationName: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    travelers: { type: Number, default: 1 },
    budgetTier: { type: String, enum: ['budget', 'moderate', 'premium', 'luxury'], default: 'moderate' },
    estimatedTotalCostINR: { type: Number, default: 0 },
    interests: [{ type: String }],
    travelStyle: { type: String, default: 'solo' },
    itinerary: [dayPlanSchema],
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
    safetyNotes: { type: String, default: '' },
    generatedBy: { type: String, enum: ['local-engine', 'external-ai'], default: 'local-engine' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
