require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (falls back to local JSON files if unavailable)
connectDB();

const originalConsoleError = console.error;
global.latestErrors = [];
console.error = (...args) => {
  global.latestErrors.push({
    timestamp: new Date().toISOString(),
    message: args.map(a => {
      if (a instanceof Error) return a.message + '\n' + a.stack;
      return typeof a === 'object' ? JSON.stringify(a) : String(a);
    }).join(' ')
  });
  if (global.latestErrors.length > 50) global.latestErrors.shift();
  originalConsoleError.apply(console, args);
};

app.get('/api/debug-errors', (req, res) => {
  res.json(global.latestErrors);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static assets (for images/videos if needed in production)
app.use('/public', express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', apiRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Manivtha Tours & Travels API.',
    status: 'Healthy',
    database: require('./config/db').isFallback() ? 'Fallback (Local JSON)' : 'MongoDB Atlas'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
