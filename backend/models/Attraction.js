/** @format */

// models/Attraction.js

const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		pictures: [
			{
				type: String, // URLs or paths to images
				required: true,
			},
		],
		location: {
			type: String,
			required: true,
		},
		openingHours: {
			type: String, // e.g., "9 AM - 5 PM"
			required: true,
		},
		ticketPrices: {
			native: {
				type: Number,
				required: true,
			},
			foreigner: {
				type: Number,
				required: true,
			},
			student: {
				type: Number,
				required: true,
			},
		},
		tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], // Reference to Tag schema
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Attraction', attractionSchema);
