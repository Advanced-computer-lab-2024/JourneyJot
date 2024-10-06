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
	// Add any additional fields you want for sellers here
});

// Create the SellerProfile model
const SellerProfile = mongoose.model('SellerProfile', sellerProfileSchema);

module.exports = SellerProfile;
