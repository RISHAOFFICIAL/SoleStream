const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/listings
router.get('/', (req, res) => {
  const { page = 1, limit = 12, search, min_price, max_price } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT l.* 
      FROM listings l
      WHERE l.status = 'active'
    `;
    const params = [];

    if (search) {
      query += ` AND (l.title LIKE ? OR l.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (min_price) {
      query += ` AND l.price_cents >= ?`;
      params.push(min_price);
    }

    if (max_price) {
      query += ` AND l.price_cents <= ?`;
      params.push(max_price);
    }

    // Count total for pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${query})`;
    const totalCount = db.prepare(countQuery).get(...params).total;

    query += ` ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const listings = db.prepare(query).all(...params);

    // Get primary preview for each listing
    const listingsWithPreviews = listings.map(listing => {
      const preview = db.prepare('SELECT id FROM listing_assets WHERE listing_id = ? AND asset_type = "preview" LIMIT 1').get(listing.id);
      return {
        ...listing,
        preview_url: preview ? `/api/delivery/preview/${preview.id}` : null
      };
    });

    res.json({
      success: true,
      pagination: {
        total_listings: totalCount,
        total_pages: Math.ceil(totalCount / limit),
        current_page: parseInt(page),
        limit: parseInt(limit)
      },
      listings: listingsWithPreviews
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/listings/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const listing = db.prepare(`
      SELECT l.* 
      FROM listings l
      WHERE l.id = ? AND l.status = 'active'
    `).get(id);

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const previews = db.prepare('SELECT id FROM listing_assets WHERE listing_id = ? AND asset_type = "preview"').all(id);

    res.json({
      success: true,
      listing: {
        ...listing,
        preview_urls: previews.map(p => `/api/delivery/preview/${p.id}`)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
