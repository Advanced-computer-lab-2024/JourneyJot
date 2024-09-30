const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    // ... other fields specific to Itinerary
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourGuide', // Assuming Tour Guides create itineraries
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
