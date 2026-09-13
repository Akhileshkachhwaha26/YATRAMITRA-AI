const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Experience = require('../models/Experience');
const Hotel = require('../models/Hotel');
const { isPaymentConfigured, createOrder, verifySignature } = require('../services/paymentService');

const MODEL_MAP = { experience: Experience, hotel: Hotel };
const AMOUNT_FIELD = { experience: 'priceINR', hotel: 'pricePerNightINR' };

// @desc    Check whether payments are configured (frontend uses this to
//          show/hide the "Pay now" button vs an "inquiry only" fallback)
// @route   GET /api/payments/status
// @access  Public
const getPaymentStatus = asyncHandler(async (req, res) => {
  res.json({ success: true, configured: isPaymentConfigured() });
});

// @desc    Create a Razorpay order for an experience or hotel booking
// @route   POST /api/payments/create-order
// @access  Private
const createPaymentOrder = asyncHandler(async (req, res) => {
  if (!isPaymentConfigured()) {
    res.status(501);
    throw new Error(
      'Payments are not configured on this server yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env to enable bookings.'
    );
  }

  const { itemType, itemId } = req.body;
  const Model = MODEL_MAP[itemType];
  if (!Model) {
    res.status(400);
    throw new Error('itemType must be "experience" or "hotel"');
  }

  const item = await Model.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const amountINR = item[AMOUNT_FIELD[itemType]];
  const order = await createOrder({
    amountINR,
    receipt: `${itemType}_${itemId}_${Date.now()}`,
    notes: { itemType, itemId: String(itemId), userId: String(req.user._id) },
  });

  const payment = await Payment.create({
    user: req.user._id,
    itemType,
    itemId,
    itemName: item.name || item.title,
    amountINR,
    razorpayOrderId: order.id,
    status: 'created',
  });

  res.status(201).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentRecordId: payment._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  });
});

// @desc    Verify a completed payment's signature and mark it paid
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentRecordId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const payment = await Payment.findById(paymentRecordId);
  if (!payment) {
    res.status(404);
    throw new Error('Payment record not found');
  }
  if (payment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const valid = verifySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = valid ? 'paid' : 'failed';
  await payment.save();

  if (!valid) {
    res.status(400);
    throw new Error('Payment signature verification failed');
  }

  res.json({ success: true, data: payment });
});

module.exports = { getPaymentStatus, createPaymentOrder, verifyPayment };
