/** @format */

// routes/userRoutes.js

const express = require('express');
const auth_check = require('../middleware/auth-check');
const {
	createAdvertiserProfile,
	getAdvertiserProfile,
} = require('../controllers/advertiser');
const advertiserRouter = express.Router();
// Update tour guide profile
advertiserRouter.put('/profile', auth_check, createAdvertiserProfile);
advertiserRouter.get('/profile', auth_check, getAdvertiserProfile);

module.exports = advertiserRouter;
