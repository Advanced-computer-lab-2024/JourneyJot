/** @format */

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The recipient of the notification
	message: { type: String, required: true },
	read: { type: Boolean, default: false }, // Indicates if the notification has been read
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);
