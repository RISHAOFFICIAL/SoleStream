const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'mock_key');

// POST /api/webhooks/stripe
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // In development or if no secret, assume mock
      event = JSON.parse(req.body);
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleCheckoutSessionCompleted(session) {
  const { listing_id, buyer_email } = session.metadata;
  const amount_total = session.amount_total;
  const payment_intent = session.payment_intent;
  const now = Math.floor(Date.now() / 1000);

  try {
    const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(listing_id);
    if (!listing) return;

    const order_id = crypto.randomUUID();
    const commission = Math.round(amount_total * 0.20);
    const payout = amount_total - commission;

    const transaction = db.transaction(() => {
      // Create Order
      db.prepare(`
        INSERT INTO orders (id, buyer_email, listing_id, seller_id, amount_total_cents, commission_cents, seller_payout_cents, status, stripe_payment_intent_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(order_id, buyer_email, listing_id, listing.seller_id, amount_total, commission, payout, 'completed', payment_intent, now, now);

      // Create Delivery Token
      const token = crypto.randomBytes(32).toString('hex');
      const expires_at = now + (48 * 60 * 60); // 48 hours

      db.prepare(`
        INSERT INTO deliveries (id, order_id, download_token, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), order_id, token, expires_at, now);
    });

    transaction();
    console.log(`Order created: ${order_id}`);
  } catch (err) {
    console.error('Error handling checkout.session.completed:', err);
  }
}

module.exports = router;
