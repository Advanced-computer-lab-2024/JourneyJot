/** @format */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	touristId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tourist',
		required: true,
	},
	tourGuideId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true,
	},
	comment: {
		type: String,
		trim: true,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('ReviewEvent', reviewSchema);
