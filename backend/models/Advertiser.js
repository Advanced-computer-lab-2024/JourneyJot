/** @format */

// models/AdvertiserProfile.js
const mongoose = require('mongoose');

const advertiserProfileSchema = new mongoose.Schema({
	website: {
		type: String,
		required: true,
		trim: true,
	},
	hotline: {
		type: String,
		required: true,
	},
	companyProfile: {
		type: String,
		required: true,
	},
	// Add any additional fields you want for advertisers here
});

// Create the AdvertiserProfile model
const AdvertiserProfile = mongoose.model(
	'AdvertiserProfile',
	advertiserProfileSchema
);

module.exports = AdvertiserProfile;
