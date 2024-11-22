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
		rating: {
			type: Number,
			required: false,
			min: 1,
			max: 5,
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
		ratings: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' },
				rating: { type: Number, required: true },
				comment: { type: String },
			},
		],
		flagged: { type: Boolean, default: false },
		isBooked: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
