const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const Experience = require('../models/Experience');
const Business = require('../models/Business');
const Trip = require('../models/Trip');

// @desc    Get platform-wide stats for admin dashboard
// @route   GET /api/admin/stats
// @access  Private (admin)
const getStats = asyncHandler(async (req, res) => {
  const [users, destinations, hotels, experiences, businesses, trips] = await Promise.all([
    User.countDocuments(),
    Destination.countDocuments(),
    Hotel.countDocuments(),
    Experience.countDocuments(),
    Business.countDocuments(),
    Trip.countDocuments(),
  ]);

  // Simple user-growth-by-month aggregation (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const topDestinations = await Destination.find({}).sort({ popularity: -1 }).limit(5).select('name popularity rating');

  res.json({
    success: true,
    data: {
      counts: { users, destinations, hotels, experiences, businesses, trips },
      userGrowth,
      topDestinations,
    },
  });
});

// @desc    List all users (admin)
// @route   GET /api/admin/users
// @access  Private (admin)
const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

// @desc    List all providers/businesses for moderation
// @route   GET /api/admin/businesses
// @access  Private (admin)
const listAllBusinesses = asyncHandler(async (req, res) => {
  const businesses = await Business.find({}).sort({ createdAt: -1 });
  res.json({ success: true, count: businesses.length, data: businesses });
});

// @desc    Approve/suspend a business listing
// @route   PUT /api/admin/businesses/:id/status
// @access  Private (admin)
const updateBusinessStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const business = await Business.findById(req.params.id);
  if (!business) {
    res.status(404);
    throw new Error('Business not found');
  }
  business.status = status;
  await business.save();
  res.json({ success: true, data: business });
});

module.exports = { getStats, listUsers, listAllBusinesses, updateBusinessStatus };
