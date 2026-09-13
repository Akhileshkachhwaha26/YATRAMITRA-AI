const asyncHandler = require('express-async-handler');
const Hotel = require('../models/Hotel');

// @desc    Get hotels with filters
// @route   GET /api/hotels
// @access  Public
const getHotels = asyncHandler(async (req, res) => {
  const { destination, priceTier, minRating, ecoFriendly, sort, limit } = req.query;
  const query = {};

  if (destination) query.destination = destination;
  if (priceTier) query.priceTier = priceTier;
  if (minRating) query.rating = { $gte: parseFloat(minRating) };
  if (ecoFriendly === 'true') query.isEcoFriendly = true;

  let cursor = Hotel.find(query).populate('destination', 'name slug');

  if (sort === 'price-low') cursor = cursor.sort({ pricePerNightINR: 1 });
  else if (sort === 'price-high') cursor = cursor.sort({ pricePerNightINR: -1 });
  else cursor = cursor.sort({ rating: -1 });

  if (limit) cursor = cursor.limit(parseInt(limit, 10));

  const hotels = await cursor.exec();
  res.json({ success: true, count: hotels.length, data: hotels });
});

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate('destination', 'name slug');
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }
  res.json({ success: true, data: hotel });
});

module.exports = { getHotels, getHotelById };
