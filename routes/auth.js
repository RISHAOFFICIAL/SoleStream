const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, role, handle } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  if (role === 'seller' && !handle) {
    return res.status(400).json({ success: false, error: 'Handle is required for sellers' });
  }

  try {
    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    if (role === 'seller') {
      const existingHandle = db.prepare('SELECT * FROM seller_profiles WHERE handle = ?').get(handle);
      if (existingHandle) {
        return res.status(400).json({ success: false, error: 'Handle already taken' });
      }
    }

    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const now = Math.floor(Date.now() / 1000);

    const insertUser = db.transaction(() => {
      db.prepare('INSERT INTO users (id, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
        .run(userId, email.toLowerCase(), passwordHash, role, now, now);

      if (role === 'seller') {
        db.prepare('INSERT INTO seller_profiles (user_id, handle, created_at, updated_at) VALUES (?, ?, ?, ?)')
          .run(userId, handle, now, now);
      }
    });

    insertUser();

    // Create token
    const token = jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      user: {
        id: userId,
        email: email.toLowerCase(),
        role,
        created_at: now
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Missing email or password' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, role FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let seller_profile = null;
    if (user.role === 'seller') {
      seller_profile = db.prepare('SELECT handle, is_premium, stripe_connect_account_id FROM seller_profiles WHERE user_id = ?').get(user.id);
    }

    res.json({
      success: true,
      user: {
        ...user,
        seller_profile: seller_profile ? {
          handle: seller_profile.handle,
          is_premium: !!seller_profile.is_premium,
          stripe_connected: !!seller_profile.stripe_connect_account_id
        } : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
