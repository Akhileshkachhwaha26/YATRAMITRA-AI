const asyncHandler = require('express-async-handler');
const Destination = require('../models/Destination');
const {
  recommendDestinations,
  generateItinerary,
  findHiddenGemAlternative,
} = require('../services/recommendationService');
const { generateItineraryWithExternalAI, generateChatReplyWithExternalAI } = require('../services/externalAIService');

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// @desc    Generate a full AI trip itinerary
// @route   POST /api/ai/plan-trip
// @access  Public (works for guests; saving requires auth, handled client-side)
const planTrip = asyncHandler(async (req, res) => {
  const {
    destinationId,
    destinationName,
    days = 3,
    budgetTier = 'moderate',
    interests = [],
    travelers = 1,
    travelStyle = 'solo',
  } = req.body;

  let destination = null;
  if (destinationId) destination = await Destination.findById(destinationId);
  else if (destinationName) {
    destination = await Destination.findOne({ name: new RegExp(`^${String(destinationName).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
  }

  if (!destination) {
    res.status(404);
    throw new Error('Destination not found. Please pick a destination from Explore.');
  }

  const safeInterests = Array.isArray(interests) ? interests.slice(0, 8).map(String).filter(Boolean) : [];
  const genParams = {
    destination,
    days: clamp(parseInt(days, 10) || 3, 1, 14),
    budgetTier,
    interests: safeInterests,
    travelers: clamp(parseInt(travelers, 10) || 1, 1, 12),
    travelStyle,
  };

  // Try a real LLM first (only runs if an API key is configured); fall
  // back to the deterministic local engine if it's absent, errors out,
  // times out, or returns something we can't validate.
  const external = await generateItineraryWithExternalAI(genParams);
  const { itinerary, estimatedTotalCostINR } = external || generateItinerary(genParams);
  const generatedBy = external?.provider || 'local-engine';

  const allDestinations = await Destination.find({});
  const hiddenGemAlternative =
    destination.popularity > 75 ? findHiddenGemAlternative(destination, allDestinations) : null;

  res.json({
    success: true,
    generatedBy,
    data: {
      destinationId: destination._id,
      destinationName: destination.name,
      title: `${destination.name} — ${itinerary.length}-Day ${travelStyle} Trip`,
      itinerary,
      estimatedTotalCostINR,
      budgetTier,
      travelers,
      interests,
      travelStyle,
      safetyNotes: destination.safetyNotes,
      hiddenGemAlternative,
      generatedBy,
    },
  });
});

// @desc    Recommend destinations based on preferences
// @route   POST /api/ai/recommend
// @access  Public
const recommend = asyncHandler(async (req, res) => {
  const { interests = [], budgetTier = 'moderate', season, preferPopular = false, limit = 8 } = req.body;
  const safeInterests = Array.isArray(interests) ? interests.slice(0, 8).map(String).filter(Boolean) : [];
  const safeLimit = clamp(parseInt(limit, 10) || 8, 1, 20);
  const destinations = await Destination.find({});
  const ranked = recommendDestinations(
    destinations,
    { interests: safeInterests, budgetTier, season: typeof season === 'string' ? season.slice(0, 30) : undefined, preferPopular: Boolean(preferPopular) },
    safeLimit
  );

  res.json({
    success: true,
    generatedBy: 'local-engine',
    data: ranked.map((r) => ({
      destination: r.destination,
      score: r.score,
      reasons: r.reasons,
    })),
  });
});

// @desc    Chat with the YatraMitra AI assistant widget
// @route   POST /api/ai/chat
// @access  Public
const chat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message || typeof message !== 'string' || !message.trim() || message.length > 1000) {
    res.status(400);
    throw new Error('A message is required.');
  }

  // Ground the reply in real catalog data, same text index the Explore
  // search uses, so the assistant (AI or local) only talks about places
  // that actually exist in our data.
  let destinations = [];
  try {
    destinations = await Destination.find({ $text: { $search: message } }).limit(4);
  } catch {
    destinations = [];
  }
  if (!destinations.length) {
    destinations = await Destination.find({}).sort({ popularity: -1 }).limit(4);
  }

  const safeHistory = Array.isArray(history) ? history.slice(-6).map(h => ({ role: h?.role === 'user' ? 'user' : 'assistant', text: String(h?.text || '').slice(0, 800) })) : [];
  const external = await generateChatReplyWithExternalAI({ message: message.trim(), history: safeHistory, destinations });
  if (external) {
    res.json({
      success: true,
      generatedBy: external.provider,
      data: { text: external.text, destinationId: destinations[0]?._id },
    });
    return;
  }

  // Local fallback: the same grounded keyword reasoning the widget always
  // used before — never a random or invented answer.
  const top = destinations[0];
  const text = top
    ? `Based on what you're looking for, I'd suggest starting with ${top.name} — ${
        top.shortDescription || 'it matches your interests well'
      }. A few other options worth a look: ${destinations.slice(1).map((d) => d.name).join(', ') || 'browse Explore for more'}.`
    : "I couldn't find a strong match for that — try the AI Planner for a full day-by-day itinerary, or browse Explore for hidden gems.";

  res.json({ success: true, generatedBy: 'local-engine', data: { text, destinationId: top?._id } });
});

module.exports = { planTrip, recommend, chat };
