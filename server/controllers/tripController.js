const asyncHandler = require('express-async-handler');
const Trip = require('../models/Trip');

// @desc    Create/save a trip
// @route   POST /api/trips
// @access  Private
const createTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, data: trip });
});

// @desc    Get logged-in user's trips
// @route   GET /api/trips
// @access  Private
const getMyTrips = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { user: req.user._id };
  if (status) query.status = status;
  const trips = await Trip.find(query).sort({ createdAt: -1 });
  res.json({ success: true, count: trips.length, data: trips });
});

// @desc    Get a single trip
// @route   GET /api/trips/:id
// @access  Private
const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this trip');
  }
  res.json({ success: true, data: trip });
});

// @desc    Update a trip (e.g. status, regenerate)
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this trip');
  }
  Object.assign(trip, req.body);
  await trip.save();
  res.json({ success: true, data: trip });
});

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this trip');
  }
  await trip.deleteOne();
  res.json({ success: true, message: 'Trip deleted' });
});

module.exports = { createTrip, getMyTrips, getTripById, updateTrip, deleteTrip };
