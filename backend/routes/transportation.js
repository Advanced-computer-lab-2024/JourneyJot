/** @format */

// routes/transportation.js
const express = require('express');
const transportationRouter = express.Router();
const authenticate = require('../middleware/auth-check'); // Assuming you have an auth middleware
const advertiserCheck = require('../middleware/advertiser-check');
const adminAdvertiser = require('../middleware/admin-advertiser');
const {
	createTransportation,
	bookTransportation,
	listTransportation,
} = require('../controllers/transportation');

// Create transportation (this route requires authentication)
transportationRouter.post(
	'/create',
	authenticate,
	advertiserCheck,
	createTransportation
);

// List available transportation (excluding archived)
transportationRouter.get('/', listTransportation);
module.exports = transportationRouter;
