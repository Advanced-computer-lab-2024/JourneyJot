/** @format */

const mongoose = require('mongoose');

const NotificationItineraryTouristSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tourist',
		required: true,
	}, // The recipient of the notification
	itineraryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Itinerary',
		required: true,
	},
	message: { type: String, required: true },
	read: { type: Boolean, default: false }, // Indicates if the notification has been read
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
	'NotificationItineraryTourist',
	NotificationItineraryTouristSchema
);
