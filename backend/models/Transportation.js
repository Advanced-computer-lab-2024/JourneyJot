/** @format */

// models/Transportation.js
const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema({
	advertiser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	vehicleType: { type: String, required: true },
	availableSeats: { type: Number, required: true },
	pricePerSeat: { type: Number, required: true },
	location: { type: String, required: true },
	isArchived: { type: Boolean, default: false },
	seatsBooked: {
		type: Map, // A Map to store userId -> bookedSeats pairs
		of: Number,
		default: {},
	},
});

module.exports = mongoose.model('Transportation', transportationSchema);
