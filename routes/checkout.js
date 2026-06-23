const express = require('express');
const router = express.Router();
const db = require('../db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'mock_key');

// POST /api/checkout/create-session
router.post('/create-session', async (req, res) => {
  const { listing_id, buyer_email } = req.body;

  if (!listing_id || !buyer_email) {
    return res.status(400).json({ success: false, error: 'Missing listing_id or buyer_email' });
  }

  try {
    const listing = db.prepare(`
      SELECT l.*, sp.stripe_connect_account_id, sp.handle
      FROM listings l
      JOIN seller_profiles sp ON l.seller_id = sp.user_id
      WHERE l.id = ? AND l.status = 'active'
    `).get(listing_id);

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    if (!listing.stripe_connect_account_id && process.env.STRIPE_SECRET_KEY) {
      return res.status(400).json({ success: false, error: 'Seller has not connected Stripe' });
    }

    // If no stripe key, return a mock URL
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_...') {
      console.log('Mocking Stripe session creation');
      return res.json({
        success: true,
        checkout_url: `${process.env.DOMAIN || 'http://localhost:3000'}/checkout/success?mock=true&listing_id=${listing_id}&email=${buyer_email}`
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: listing.title,
            description: `Discreet download pack from @${listing.handle}`,
          },
          unit_amount: listing.price_cents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      payment_intent_data: {
        application_fee_amount: Math.round(listing.price_cents * 0.20), // 20% platform commission
        transfer_data: {
          destination: listing.stripe_connect_account_id,
        },
      },
      success_url: `${process.env.DOMAIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/listings/${listing_id}`,
      customer_email: buyer_email,
      metadata: {
        listing_id: listing.id,
        buyer_email: buyer_email
      }
    });

    res.json({
      success: true,
      checkout_url: session.url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Stripe session creation failed' });
  }
});

module.exports = router;
