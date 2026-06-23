const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

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

// Protect all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/profile
router.get('/profile', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM seller_profiles WHERE user_id = ?').get(req.user.id);
    res.json({ success: true, profile: profile || { handle: 'SoleStream', bio: '' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/admin/profile
router.put('/profile', (req, res) => {
  const { handle, bio } = req.body;
  const now = Math.floor(Date.now() / 1000);
  try {
    db.prepare(`
      UPDATE seller_profiles 
      SET handle = ?, bio = ?, updated_at = ?
      WHERE user_id = ?
    `).run(handle, bio || '', now, req.user.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/admin/listings
router.post('/listings', upload.fields([
  { name: 'preview_image', maxCount: 1 },
  { name: 'full_resolution_archive', maxCount: 1 }
]), async (req, res) => {
  const { title, description, price_cents } = req.body;
  const admin_id = req.user.id;

  if (!title || !price_cents || !req.files['preview_image'] || !req.files['full_resolution_archive']) {
    return res.status(400).json({ success: false, error: 'Missing required fields or files' });
  }

  const listing_id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  try {
    const previewFile = req.files['preview_image'][0];
    const fullFile = req.files['full_resolution_archive'][0];

    const previewOutputPath = path.join(__dirname, '../public/previews', `preview-${listing_id}.jpg`);
    await sharp(previewFile.path)
      .resize(800, 800, { fit: 'inside' })
      .toFormat('jpeg')
      .toFile(previewOutputPath);

    const insertTransaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO listings (id, seller_id, title, description, price_cents, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(listing_id, admin_id, title, description || '', parseInt(price_cents), 'active', now, now);

      db.prepare(`
        INSERT INTO listing_assets (id, listing_id, asset_type, file_path, file_size, mime_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), listing_id, 'preview', previewOutputPath, fs.statSync(previewOutputPath).size, 'image/jpeg', now);

      db.prepare(`
        INSERT INTO listing_assets (id, listing_id, asset_type, file_path, file_size, mime_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), listing_id, 'full', fullFile.path, fullFile.size, fullFile.mimetype, now);
    });

    insertTransaction();
    res.status(201).json({ success: true, listing_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/admin/listings
router.get('/listings', (req, res) => {
  try {
    const listings = db.prepare('SELECT * FROM listings WHERE status != "archived" ORDER BY created_at DESC').all();
    res.json({ success: true, listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/admin/listings/:id
router.put('/listings/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, price_cents, status } = req.body;
  const now = Math.floor(Date.now() / 1000);
  try {
    db.prepare(`
      UPDATE listings 
      SET title = ?, description = ?, price_cents = ?, status = ?, updated_at = ?
      WHERE id = ?
    `).run(title, description, price_cents, status, now, id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/admin/listings/:id
router.delete('/listings/:id', (req, res) => {
  const { id } = req.params;
  const now = Math.floor(Date.now() / 1000);
  try {
    db.prepare("UPDATE listings SET status = 'archived', updated_at = ? WHERE id = ?").run(now, id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/admin/analytics
router.get('/analytics', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        SUM(amount_total_cents) as gross_sales,
        COUNT(*) as total_transactions
      FROM orders
      WHERE status = 'completed'
    `).get();

    res.json({
      success: true,
      analytics: {
        gross_sales_cents: stats.gross_sales || 0,
        total_transactions: stats.total_transactions || 0,
        average_order_value_cents: stats.total_transactions > 0 ? Math.round(stats.gross_sales / stats.total_transactions) : 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
