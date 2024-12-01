/** @format */

const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	dateOfBirth: { type: String, required: true },
	emailAddress: { type: String, required: true },
	phone: { type: String, required: true },
	documentNumber: { type: String, required: true },
	issuanceCountry: { type: String, required: true },
	nationality: { type: String, required: true },
	issuanceDate: { type: String, required: true },
	expiryDate: { type: String, required: true },
});

const FlightSchema = new mongoose.Schema({
	flightId: { type: String, required: true },
	origin: { type: String, required: true },
	destination: { type: String, required: true },
	departureDate: { type: String, required: true },
	price: {
		currency: { type: String },
		total: { type: String },
	},
	seatsAvailable: { type: Number },
	airline: { type: [String] },
	tourist: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tourist',
		required: true,
	},
	passenger: { type: PassengerSchema, required: true }, // Embedded passenger data
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Flight', FlightSchema);
