/** @format */

// models/Itinerary.js

const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
	{
		tourGuideId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // Reference to the user (tour guide)
			required: true,
		},
		activities: [
			{
				type: String, // You can define a more complex schema for activities if needed
				required: true,
			},
		],
		locations: [
			{
				type: String,
				required: true,
			},
		],
		timeline: {
			type: String, // or you can use a more structured format like an array
			required: true,
		},
		duration: {
			type: String, // e.g., "2 hours"
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		availableDates: [
			{
				type: Date,
				required: true,
			},
		],
		accessibility: {
			type: String, // e.g., "wheelchair accessible"
			required: true,
		},
		pickupLocation: {
			type: String,
			required: true,
		},
		dropoffLocation: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);