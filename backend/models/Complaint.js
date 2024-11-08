/** @format */

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
	reply: { type: String, default: 'no reply yet' },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
