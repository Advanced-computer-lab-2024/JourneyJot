const express = require('express');
const router = express.Router();
const { getTouristDetails, updateTouristDetails } = require('..//controllers//touristController');
const verifyTourist = require('..//middlewares//touristMiddleware'); // Middleware for authentication


// GET route to read tourist's information
router.get('/me', verifyTourist, getTouristDetails);

// PUT route to update tourist's information (excluding username and wallet)
router.put('/me', verifyTourist, updateTouristDetails);

module.exports = router;
