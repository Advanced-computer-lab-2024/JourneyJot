/** @format */

// models/Attraction.js

const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: false,
		},
		description: {
			type: String,
			required: false,
		},
		pictures: [
			{
				type: String, // URLs or paths to images
				required: false,
			},
		],
		location: {
			type: String,
			required: false,
		},
		openingHours: {
			type: String, // e.g., "9 AM - 5 PM"
			required: false,
		},
		ticketPrices: {
			native: {
				type: Number,
				required: false,
			},
			foreigner: {
				type: Number,
				required: false,
			},
			student: {
				type: Number,
				required: false,
			},
		},
		tags: {
			type: [String],
			required: true, // The tag is required
			unique: true, // The tag must be unique across the collection
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Attraction', attractionSchema);
