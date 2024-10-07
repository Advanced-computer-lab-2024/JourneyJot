/** @format */

// routes/userRoutes.js

const express = require('express');

const {
	createTourGuideProfile,
	getTourGuideProfile,
} = require('../controllers/tour-guide');
const auth_check = require('../middleware/auth-check');
const tourGuideCheck = require('../middleware/tour-guide-check');
const tourGuideRouter = express.Router();
// Update tour guide profile
tourGuideRouter.put(
	'/profile',
	auth_check,
	tourGuideCheck,
	createTourGuideProfile
);
tourGuideRouter.get(
	'/profile',
	auth_check,
	tourGuideCheck,
	getTourGuideProfile
);

module.exports = tourGuideRouter;
