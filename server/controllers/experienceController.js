const asyncHandler = require('express-async-handler');
const Experience = require('../models/Experience');

// @desc    Get experiences with filters
// @route   GET /api/experiences
// @access  Public
const getExperiences = asyncHandler(async (req, res) => {
  const { destination, category, maxPrice, sort, limit } = req.query;
  const query = {};

  if (destination) query.destination = destination;
  if (category) query.category = category;
  if (maxPrice) query.priceINR = { $lte: parseFloat(maxPrice) };

  let cursor = Experience.find(query).populate('destination', 'name slug');

  if (sort === 'price-low') cursor = cursor.sort({ priceINR: 1 });
  else if (sort === 'price-high') cursor = cursor.sort({ priceINR: -1 });
  else cursor = cursor.sort({ rating: -1 });

  if (limit) cursor = cursor.limit(parseInt(limit, 10));

  const experiences = await cursor.exec();
  res.json({ success: true, count: experiences.length, data: experiences });
});

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
const getExperienceById = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id).populate('destination', 'name slug');
  if (!experience) {
    res.status(404);
    throw new Error('Experience not found');
  }
  res.json({ success: true, data: experience });
});

module.exports = { getExperiences, getExperienceById };
