/** @format */

const mongoose = require('mongoose');

// Create a sub-schema for the Tour Guide Profile
const tourGuideProfileSchema = new mongoose.Schema({
	mobileNumber: {
		type: String,
		trim: true,
		required: [true, 'Mobile number is required'],
		match: /^\d{11}$/,
	},
	yearsOfExperience: {
		type: Number,
		required: [true, 'Years of experience is required'],
	},
	previousWork: {
		type: String,
		trim: true,
		required: [false, 'Previous work experience is not required'],
	},
	image: {
		type: String, // Image is stored as a string URL in MongoDB
		default: null, // Default image is null if no image is provided
	},
	file: {
		type: String, // File is stored as a string URL in MongoDB
		default: null, // Default file is null if no file is provided
	},
});
const TourGuideProfile = mongoose.model(
	'TourGuideProfile',
	tourGuideProfileSchema
);

module.exports = TourGuideProfile;
