require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(cookieParser());

// Webhook route (must be before express.json() to get raw body)
app.use('/api/webhook', require('./routes/webhooks'));

app.use(express.json());

// Other Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/sellers', require('./routes/sellers'));
app.use('/api/seller', require('./routes/seller'));
app.use('/api/checkout', require('./routes/checkout'));
app.use('/api/delivery', require('./routes/delivery'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// SPA catch-all route (handled via middleware to avoid Express 5 path-to-regexp issues)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(__dirname, 'frontend/dist/index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SoleStream Backend listening on port ${PORT}`);
});
