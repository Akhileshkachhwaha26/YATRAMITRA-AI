const asyncHandler = require('express-async-handler');
const Destination = require('../models/Destination');
const { findHiddenGemAlternative } = require('../services/recommendationService');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get all destinations (with search/filter/sort)
// @route   GET /api/destinations
// @access  Public
const getDestinations = asyncHandler(async (req, res) => {
  const { search, state, budget, tag, sort, hiddenGems, trending, wheelchairFriendly, limit } = req.query;
  const query = {};

  if (search && typeof search === 'string' && search.trim().length <= 80) query.$text = { $search: search.trim() };
  if (state) query.state = state;
  if (budget) query.budgetLevel = budget;
  if (tag) query.tags = tag;
  if (hiddenGems === 'true') query.isHiddenGem = true;
  if (trending === 'true') query.isTrending = true;
  if (wheelchairFriendly === 'true') query['accessibility.wheelchairFriendly'] = true;

  let cursor = Destination.find(query);

  switch (sort) {
    case 'rating':
      cursor = cursor.sort({ rating: -1 });
      break;
    case 'popularity':
      cursor = cursor.sort({ popularity: -1 });
      break;
    case 'budget-low':
      cursor = cursor.sort({ avgCostPerDayINR: 1 });
      break;
    case 'budget-high':
      cursor = cursor.sort({ avgCostPerDayINR: -1 });
      break;
    default:
      cursor = cursor.sort({ createdAt: -1 });
  }

  if (limit) cursor = cursor.limit(parseInt(limit, 10));

  const destinations = await cursor.exec();
  res.json({ success: true, count: destinations.length, data: destinations });
});

// @desc    Get single destination by id or slug
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const destination = id.match(/^[0-9a-fA-F]{24}$/)
    ? await Destination.findById(id)
    : await Destination.findOne({ slug: id });

  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  const all = await Destination.find({});
  const hiddenGemAlternative = destination.popularity > 75 ? findHiddenGemAlternative(destination, all) : null;

  res.json({ success: true, data: destination, hiddenGemAlternative });
});

module.exports = { getDestinations, getDestinationById };
