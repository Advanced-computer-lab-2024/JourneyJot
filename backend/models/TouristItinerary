/** @format */

const mongoose = require('mongoose');

const TouristItinerarySchema = new mongoose.Schema({
	activities: [String], // List of activities
	locations: [String], // List of locations to visit
	startDate: Date, // Start of the itinerary date range
	endDate: Date, // End of the itinerary date range
	tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], // Tags for the itinerary
	tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }, // Tourist who created the itinerary
});

const TouristItinerary = mongoose.model(
	'TouristItinerary',
	TouristItinerarySchema
);
module.exports = TouristItinerary;
