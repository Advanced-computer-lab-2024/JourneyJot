/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema(
	{
		title: { type: String, required: true },
		activities: [{ type: String, required: true }],
		locations: [{ lat: Number, lng: Number }],
		timeline: { type: String },
		duration: { type: String, required: true },
		language: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
		availableDates: [{ type: Date, default: [] }],
		accessibility: { type: Boolean, default: false },
		pickupLocation: { type: String, required: true },
		dropOffLocation: { type: String, required: true },
	},
	{ timestamps: true }
);

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
module.exports = TourGuide;
