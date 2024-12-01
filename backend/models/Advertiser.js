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
	image: {
		type: String, // Image is stored as a string URL in MongoDB
		default: null, // Default image is null if no image is provided
	},
	file: {
		type: String, // File is stored as a string URL in MongoDB
		default: null, // Default file is null if no file is provided
	},
	activities: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Activity',
		},
	],
});

// Create the AdvertiserProfile model
const AdvertiserProfile = mongoose.model(
	'AdvertiserProfile',
	advertiserProfileSchema
);

module.exports = AdvertiserProfile;
