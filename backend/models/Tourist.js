/** @format */

const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	mobileNumber: {
		type: String,
		required: true,
	},
	nationality: {
		type: String,
		required: true,
	},
	dob: {
		type: Date,
		required: true,
	},
	jobStatus: {
		type: String, // Either 'Job' or 'Student'
		enum: ['Job', 'Student'],
		required: true,
	},
	canBook: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Prevent changing DOB after the first save
touristSchema.pre('save', function (next) {
	if (this.isModified('dob')) {
		return next(new Error('DOB cannot be modified after registration.'));
	}
	next();
});

const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;
