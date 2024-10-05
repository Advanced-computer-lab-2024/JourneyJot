// models/TourGuide.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Tour Guide schema
const TourGuideSchema = new Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    experience: { type: Number, required: true }, // Years of experience
    previousWork: { type: String, default: '' }, // Previous work experience
    accepted: { type: Boolean, default: false } // Indicates if the tour guide is accepted
});

// Create the Tour Guide model
const TourGuide = mongoose.model('TourGuide', TourGuideSchema);

module.exports = TourGuide;
