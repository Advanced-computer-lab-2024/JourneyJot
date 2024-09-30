const express = require('express');
const router = express.Router();
const tourismGovernorController = require('../controllers/tourismGovernorController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Route to get all museums created by the logged-in Tourism Governor
router.get('/museums', authenticateUser, tourismGovernorController.getMyMuseums);

// Route to get all historical places created by the logged-in Tourism Governor
router.get('/historical-places', authenticateUser, tourismGovernorController.getMyHistoricalPlaces);

module.exports = router;
