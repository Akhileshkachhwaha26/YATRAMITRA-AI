/**
 * YatraMitra AI — payment service (Razorpay)
 * ---------------------------------------------------------------
 * Wraps the Razorpay SDK for creating orders and verifying payment
 * signatures. NEVER required for the app to run — every function here
 * checks isPaymentConfigured() first, and paymentController returns a
 * clear "not configured" error instead of crashing if the keys are
 * missing, so booking buttons can stay visible in the UI without
 * breaking anything on a fresh clone.
 *
 * TO ENABLE: sign up at https://dashboard.razorpay.com (test mode is
 * free, no real money involved), grab your test Key ID/Secret from
 * Settings → API Keys, and set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in
 * server/.env, plus VITE_RAZORPAY_KEY_ID in client/.env (the public key
 * ID is safe to expose client-side; the secret never leaves the server).
 *
 * NOTE: this has been verified by code review and Razorpay's own SDK
 * conventions, but not against a live Razorpay account in this
 * environment (no network access to razorpay.com here) — test with
 * your own test-mode keys before relying on it.
 */

const crypto = require('crypto');

function isPaymentConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function getClient() {
  // Lazy-required so the app doesn't need the 'razorpay' package's
  // constructor to succeed at boot if keys are absent.
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/**
 * Creates a Razorpay order for the given amount (in INR, converted to
 * paise as Razorpay requires). Returns the order object from Razorpay,
 * which the frontend needs to open the checkout widget.
 */
async function createOrder({ amountINR, receipt, notes }) {
  if (!isPaymentConfigured()) {
    throw new Error('Payments are not configured (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET missing)');
  }
  const client = getClient();
  return client.orders.create({
    amount: Math.round(amountINR * 100), // paise
    currency: 'INR',
    receipt,
    notes,
  });
}

/**
 * Verifies the HMAC-SHA256 signature Razorpay returns after a
 * successful checkout, proving the payment wasn't tampered with
 * client-side. This MUST pass before marking a Payment as "paid".
 */
function verifySignature({ orderId, paymentId, signature }) {
  if (!isPaymentConfigured()) return false;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}

module.exports = { isPaymentConfigured, createOrder, verifySignature };
