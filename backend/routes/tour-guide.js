/** @format */

// routes/userRoutes.js

const express = require('express');

const {
	createTourGuideProfile,
	getTourGuideProfile,
} = require('../controllers/tour-guide');
const auth_check = require('../middleware/auth-check');
const tourGuideRouter = express.Router();
// Update tour guide profile
tourGuideRouter.put('/profile', auth_check, createTourGuideProfile);
tourGuideRouter.get('/profile', auth_check, getTourGuideProfile);

module.exports = tourGuideRouter;
