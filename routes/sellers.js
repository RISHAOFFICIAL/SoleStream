const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/sellers/:handle
router.get('/:handle', (req, res) => {
  const { handle } = req.params;

  try {
    const profile = db.prepare(`
      SELECT handle, bio, avatar_url, is_premium, user_id
      FROM seller_profiles 
      WHERE handle = ?
    `).get(handle);

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Seller not found' });
    }

    const listings = db.prepare(`
      SELECT id, title, price_cents, created_at
      FROM listings 
      WHERE seller_id = ? AND status = 'active'
      ORDER BY created_at DESC
    `).all(profile.user_id);

    // Add preview URLs to listings
    const listingsWithPreviews = listings.map(listing => {
      const preview = db.prepare('SELECT id FROM listing_assets WHERE listing_id = ? AND asset_type = "preview" LIMIT 1').get(listing.id);
      return {
        ...listing,
        preview_url: preview ? `/api/delivery/preview/${preview.id}` : null
      };
    });

    res.json({
      success: true,
      profile: {
        handle: profile.handle,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        is_premium: !!profile.is_premium
      },
      listings: listingsWithPreviews
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
