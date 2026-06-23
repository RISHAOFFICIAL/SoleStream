const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db');

// GET /api/delivery/preview/:id
router.get('/preview/:id', (req, res) => {
  const { id } = req.params;

  try {
    const asset = db.prepare('SELECT * FROM listing_assets WHERE id = ? AND asset_type = "preview"').get(id);
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Preview not found' });
    }

    res.sendFile(path.resolve(asset.file_path));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/delivery/:token
router.get('/:token', (req, res) => {
  const { token } = req.params;
  const now = Math.floor(Date.now() / 1000);

  try {
    const delivery = db.prepare(`
      SELECT d.*, o.listing_id 
      FROM deliveries d
      JOIN orders o ON d.order_id = o.id
      WHERE d.download_token = ?
    `).get(token);

    if (!delivery) {
      return res.status(404).json({ success: false, error: 'Invalid download link' });
    }

    if (delivery.expires_at < now) {
      return res.status(410).json({ success: false, error: 'Download link has expired' });
    }

    if (delivery.download_count >= delivery.max_downloads) {
      return res.status(403).json({ success: false, error: 'Download limit reached' });
    }

    const asset = db.prepare('SELECT * FROM listing_assets WHERE listing_id = ? AND asset_type = "full"').get(delivery.listing_id);
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' });
    }

    // Increment download count
    db.prepare('UPDATE deliveries SET download_count = download_count + 1 WHERE id = ?').run(delivery.id);

    // Stream the file
    res.setHeader('Content-Type', asset.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="solestream_pack_${delivery.listing_id}${path.extname(asset.file_path)}"`);
    
    const fileStream = fs.createReadStream(asset.file_path);
    fileStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
