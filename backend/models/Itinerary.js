// models/Itinerary.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Itinerary schema
const ItinerarySchema = new Schema({
    tourGuide: { type: Schema.Types.ObjectId, ref: 'TourGuide', required: true }, // Reference to the Tour Guide
    title: { type: String, required: true },
    activities: [
        {
            description: { type: String, required: true },
            location: { type: String, required: true },
            date: { type: Date, required: true },
        }
    ],
    dateRange: {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
    },
    tags: { type: [String], default: [] }, // Array of tags for categorization
});

// Create the Itinerary model
const Itinerary = mongoose.model('Itinerary', ItinerarySchema);

module.exports = Itinerary;