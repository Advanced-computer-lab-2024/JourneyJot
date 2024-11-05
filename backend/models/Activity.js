/** @format */

// models/Activity.js

const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema(
	{
		advertiserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // Reference to the User model
			required: false,
		},
		date: {
			type: Date,
			required: true,
		},
		time: {
			type: String,
			required: true,
		},
		location: {
			type: {
				type: String, // 'Point'
				enum: ['Point'],
				required: false,
			},
			coordinates: {
				type: [Number], // [longitude, latitude]
				required: false,
			},
		},
		price: {
			type: Number,
			required: true,
		},
		priceRange: {
			type: String,
			required: false, // If you want it to be optional
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category', // Reference to the Category model
			required: false,
		},
		tags: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tag', // Reference to the Tags model
			required: false,
		},
		specialDiscounts: {
			type: String,
			required: false,
		},
		bookingOpen: {
			type: Boolean,
			default: true,
		},
		rating: {
			type: Number,
			required: false,
			min: 1,
			max: 5,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
