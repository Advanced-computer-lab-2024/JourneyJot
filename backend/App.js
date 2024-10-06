// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Enable CORS (move this after initializing `app`)
app.use(cors());

// Set mongoose strict query to false (to prevent warnings about strict query mode)
mongoose.set('strictQuery', false);

const adminRoutes = require('./routes/adminRoutes');
const touristRoutes = require('./routes/touristRoutes');

// Middleware to parse incoming JSON requests
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Set up your routes
app.use("/admin", adminRoutes);
app.use('/tourists', touristRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MongoDB connection string is not defined.');
  process.exit(1); // Exit process if MONGO_URI is not provided
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB is connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  });
