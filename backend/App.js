const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();


const adminRoutes = require('./routes/adminRoutes');
const touristRoutes = require('./routes/touristRoutes');

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Set up your routes

app.use("/admin", adminRoutes);  
app.post('/tourists', touristRoutes);

// Handle undefined routes 
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
