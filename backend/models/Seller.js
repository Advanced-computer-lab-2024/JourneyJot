/** @format */

// models/SellerProfile.js
const mongoose = require('mongoose');

const sellerProfileSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
	},
	image: {
		type: String, // Image is stored as a string URL in MongoDB
		default: null, // Default image is null if no image is provided
	},
	// Add any additional fields you want for sellers here
});

// Create the SellerProfile model
const SellerProfile = mongoose.model('SellerProfile', sellerProfileSchema);

module.exports = SellerProfile;
