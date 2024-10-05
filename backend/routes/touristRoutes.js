const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Tourist = require('..//models//Tourist');
const { getTouristDetails, updateTouristDetails } = require('..//controllers//touristController');
const verifyTourist = require('..//middlewares//touristMiddleware'); // Middleware for authentication

// Tourist login route (without bcrypt)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Log the login request
  console.log('Login route hit');
  console.log(`Login attempt by username: ${username}`);

  try {
      // Find the tourist by username
      const tourist = await Tourist.findOne({ username });
      if (!tourist) {
          console.log('Invalid username');  // Log invalid username
          return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Simple password check (without bcrypt)
      if (password !== tourist.password) {
          console.log('Invalid password');  // Log invalid password
          return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ _id: tourist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      console.log('JWT token generated:', token);  // Log the generated token

      res.json({ token });
  } catch (error) {
      console.log('Server error during login:', error);  // Log any errors
      res.status(500).json({ message: 'Server error', error });
  }
});

// GET route to read tourist's information
router.get('/me', verifyTourist, (req, res, next) => {
  console.log('GET /me route hit');  // Log the route hit
  console.log('Tourist ID from token:', req.tourist._id);  // Log the tourist ID from token
  getTouristDetails(req, res, next);  // Call the actual controller
});

// PUT route to update tourist's information (excluding username and wallet)
router.put('/me', verifyTourist, (req, res, next) => {
  console.log('PUT /me route hit');  // Log the route hit
  console.log('Tourist ID from token:', req.tourist._id);  // Log the tourist ID from token
  console.log('Update request body:', req.body);  // Log the incoming request body
  updateTouristDetails(req, res, next);  // Call the actual controller
});

module.exports = router;
