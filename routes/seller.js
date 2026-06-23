const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const db = require('../db');
const { authMiddleware, sellerMiddleware } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../private/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Protect all seller routes
router.use(authMiddleware);
router.use(sellerMiddleware);

// POST /api/seller/listings
router.post('/listings', upload.fields([
  { name: 'preview_image', maxCount: 1 },
  { name: 'full_resolution_archive', maxCount: 1 }
]), async (req, res) => {
  const { title, description, price_cents } = req.body;
  const seller_id = req.user.id;

  if (!title || !price_cents || !req.files['preview_image'] || !req.files['full_resolution_archive']) {
    return res.status(400).json({ success: false, error: 'Missing required fields or files' });
  }

  const listing_id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  try {
    const previewFile = req.files['preview_image'][0];
    const fullFile = req.files['full_resolution_archive'][0];

    // Process preview with sharp
    const previewOutputPath = path.join(__dirname, '../public/previews', `preview-${listing_id}.jpg`);
    await sharp(previewFile.path)
      .resize(800, 800, { fit: 'inside' })
      .toFormat('jpeg')
      .toFile(previewOutputPath);

    const insertTransaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO listings (id, seller_id, title, description, price_cents, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(listing_id, seller_id, title, description || '', parseInt(price_cents), 'active', now, now);

      // Insert preview asset
      db.prepare(`
        INSERT INTO listing_assets (id, listing_id, asset_type, file_path, file_size, mime_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), listing_id, 'preview', previewOutputPath, fs.statSync(previewOutputPath).size, 'image/jpeg', now);

      // Insert full resolution asset
      db.prepare(`
        INSERT INTO listing_assets (id, listing_id, asset_type, file_path, file_size, mime_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), listing_id, 'full', fullFile.path, fullFile.size, fullFile.mimetype, now);
    });

    insertTransaction();

    res.status(201).json({
      success: true,
      message: 'Listing successfully created',
      listing_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/seller/listings (Helper for dashboard)
router.get('/listings', (req, res) => {
  try {
    const listings = db.prepare('SELECT * FROM listings WHERE seller_id = ? AND status != "archived" ORDER BY created_at DESC').all(req.user.id);
    res.json({ success: true, listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/seller/listings/:id
router.put('/listings/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, price_cents, status } = req.body;
  const now = Math.floor(Date.now() / 1000);

  try {
    const listing = db.prepare('SELECT * FROM listings WHERE id = ? AND seller_id = ?').get(id, req.user.id);
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found or unauthorized' });
    }

    db.prepare(`
      UPDATE listings 
      SET title = ?, description = ?, price_cents = ?, status = ?, updated_at = ?
      WHERE id = ?
    `).run(title || listing.title, description || listing.description, price_cents || listing.price_cents, status || listing.status, now, id);

    res.json({ success: true, listing_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/seller/listings/:id (Archive)
router.delete('/listings/:id', (req, res) => {
  const { id } = req.params;
  const now = Math.floor(Date.now() / 1000);

  try {
    const listing = db.prepare('SELECT * FROM listings WHERE id = ? AND seller_id = ?').get(id, req.user.id);
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found or unauthorized' });
    }

    db.prepare("UPDATE listings SET status = 'archived', updated_at = ? WHERE id = ?").run(now, id);
    res.json({ success: true, message: 'Listing archived' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/seller/analytics
router.get('/analytics', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        SUM(amount_total_cents) as gross_sales,
        SUM(seller_payout_cents) as net_earnings,
        COUNT(*) as total_transactions
      FROM orders
      WHERE seller_id = ? AND status = 'completed'
    `).get(req.user.id);

    const profile = db.prepare('SELECT is_premium, subscription_status FROM seller_profiles WHERE user_id = ?').get(req.user.id);

    res.json({
      success: true,
      analytics: {
        gross_sales_cents: stats.gross_sales || 0,
        net_earnings_cents: stats.net_earnings || 0,
        total_transactions: stats.total_transactions || 0,
        average_order_value_cents: stats.total_transactions > 0 ? Math.round(stats.gross_sales / stats.total_transactions) : 0,
        subscription: {
          tier: profile.is_premium ? 'premium' : 'free',
          status: profile.subscription_status || 'none'
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/seller/profile
router.get('/profile', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM seller_profiles WHERE user_id = ?').get(req.user.id);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    res.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/seller/profile
router.put('/profile', (req, res) => {
  const { bio, handle, avatar_url } = req.body;
  const now = Math.floor(Date.now() / 1000);

  try {
    const profile = db.prepare('SELECT * FROM seller_profiles WHERE user_id = ?').get(req.user.id);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    db.prepare(`
      UPDATE seller_profiles 
      SET bio = ?, handle = ?, avatar_url = ?, updated_at = ?
      WHERE user_id = ?
    `).run(
      bio !== undefined ? bio : profile.bio, 
      handle !== undefined ? handle : profile.handle, 
      avatar_url !== undefined ? avatar_url : profile.avatar_url, 
      now, 
      req.user.id
    );

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: seller_profiles.handle')) {
      return res.status(400).json({ success: false, error: 'Handle already taken' });
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
