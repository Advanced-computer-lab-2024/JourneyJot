/** @format */

const mongoose = require('mongoose');
const TourGuideProfile = require('./Tour-Guide');
const AdvertiserProfile = require('./Advertiser');
const SellerProfile = require('./Seller');

// Create a schema for the user (tour guide, advertiser, seller)
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: function () {
			// Email is required only if the role is not admin or governor
			return this.role !== 'admin' && this.role !== 'governor';
		},
		unique: true, // You still want unique emails for non-null values
		sparse: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['tour_guide', 'advertiser', 'seller', 'admin', 'governor'],
		required: true,
	},
	tourGuideProfile: {
		type: TourGuideProfile.schema, // Reference to TourGuideProfile schema
		default: null,
	},
	advertiserProfile: {
		type: AdvertiserProfile.schema,
		default: null,
	},
	sellerProfile: {
		type: SellerProfile.schema,
		default: null,
	},
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
