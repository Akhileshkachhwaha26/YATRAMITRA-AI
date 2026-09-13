const asyncHandler = require('express-async-handler');
const Business = require('../models/Business');

// @desc    Get businesses with filters
// @route   GET /api/businesses
// @access  Public
const getBusinesses = asyncHandler(async (req, res) => {
  const { destination, type, limit } = req.query;
  const query = { status: 'approved' };
  if (destination) query.destination = destination;
  if (type) query.type = type;

  let cursor = Business.find(query).sort({ rating: -1 });
  if (limit) cursor = cursor.limit(parseInt(limit, 10));

  const businesses = await cursor.exec();
  res.json({ success: true, count: businesses.length, data: businesses });
});

// @desc    Get single business
// @route   GET /api/businesses/:id
// @access  Public
const getBusinessById = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    res.status(404);
    throw new Error('Business not found');
  }
  business.analytics.views += 1;
  await business.save();
  res.json({ success: true, data: business });
});

// @desc    Create a listing (provider)
// @route   POST /api/businesses
// @access  Private (provider)
const createBusiness = asyncHandler(async (req, res) => {
  const business = await Business.create({ ...req.body, owner: req.user._id, status: 'pending' });
  res.status(201).json({ success: true, data: business });
});

// @desc    Get my listings (provider)
// @route   GET /api/businesses/mine
// @access  Private (provider)
const getMyBusinesses = asyncHandler(async (req, res) => {
  const businesses = await Business.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: businesses.length, data: businesses });
});

// @desc    Update a listing (provider, owner only)
// @route   PUT /api/businesses/:id
// @access  Private (provider)
const updateBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    res.status(404);
    throw new Error('Listing not found');
  }
  if (business.owner?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to edit this listing');
  }
  Object.assign(business, req.body);
  await business.save();
  res.json({ success: true, data: business });
});

// @desc    Delete a listing (provider, owner only)
// @route   DELETE /api/businesses/:id
// @access  Private (provider)
const deleteBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    res.status(404);
    throw new Error('Listing not found');
  }
  if (business.owner?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this listing');
  }
  await business.deleteOne();
  res.json({ success: true, message: 'Listing deleted' });
});

// @desc    Submit inquiry to a business
// @route   POST /api/businesses/:id/inquiries
// @access  Public
const submitInquiry = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    res.status(404);
    throw new Error('Listing not found');
  }
  business.inquiries.push(req.body);
  business.analytics.inquiriesCount += 1;
  await business.save();
  res.status(201).json({ success: true, message: 'Inquiry submitted' });
});

module.exports = {
  getBusinesses,
  getBusinessById,
  createBusiness,
  getMyBusinesses,
  updateBusiness,
  deleteBusiness,
  submitInquiry,
};
