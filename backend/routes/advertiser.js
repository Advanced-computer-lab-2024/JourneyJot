const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiserController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Route to get all activities created by the logged-in Advertiser
router.get('/activities', authenticateUser, advertiserController.getMyActivities);

// Add more routes if Advertisers can create other items

module.exports = router;
