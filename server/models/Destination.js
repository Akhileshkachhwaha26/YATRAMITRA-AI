const mongoose = require('mongoose');

const sustainabilitySchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 100, default: 70 },
    environment: { type: Number, min: 0, max: 100, default: 70 },
    localEconomy: { type: Number, min: 0, max: 100, default: 70 },
    crowdManagement: { type: Number, min: 0, max: 100, default: 70 },
    waste: { type: Number, min: 0, max: 100, default: 70 },
    transport: { type: Number, min: 0, max: 100, default: 70 },
  },
  { _id: false }
);

const accessibilitySchema = new mongoose.Schema(
  {
    // Editorial, general-terrain guidance (not a certified accessibility audit) —
    // see the UI disclaimer wherever this is shown.
    wheelchairFriendly: { type: Boolean, default: false },
    easyTerrain: { type: Boolean, default: true },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    state: { type: String, required: true },
    region: { type: String, default: '' },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    images: [{ type: String }],
    heroImage: { type: String, default: '' },
    rating: { type: Number, min: 0, max: 5, default: 4 },
    reviewCount: { type: Number, default: 0 },
    budgetLevel: { type: String, enum: ['budget', 'moderate', 'premium', 'luxury'], default: 'moderate' },
    avgCostPerDayINR: { type: Number, default: 1500 },
    bestSeason: [{ type: String }],
    tags: [{ type: String }],
    interests: [{ type: String }],
    attractions: [
      {
        name: String,
        description: String,
        image: String,
      },
    ],
    weather: {
      summer: String,
      monsoon: String,
      winter: String,
    },
    safetyNotes: { type: String, default: '' },
    accessibility: accessibilitySchema,
    isHiddenGem: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    popularity: { type: Number, default: 50 }, // 0-100, used for crowding/over-tourism logic
    alternativeTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', default: null }, // hidden gem -> maps to popular dest
    latitude: { type: Number },
    longitude: { type: Number },
    sustainability: sustainabilitySchema,
  },
  { timestamps: true }
);

destinationSchema.index({ name: 'text', state: 'text', tags: 'text', description: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
