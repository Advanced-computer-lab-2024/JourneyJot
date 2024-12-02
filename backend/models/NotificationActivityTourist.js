/** @format */

const mongoose = require('mongoose');

const NotificationTouristSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tourist',
		required: true,
	}, // The recipient of the notification
	activityId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Activity',
		required: true,
	}, // Linked activity
	message: { type: String, required: true },
	read: { type: Boolean, default: false }, // Indicates if the notification has been read
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
	'NotificationActivityTourist',
	NotificationTouristSchema
);
