// models/Itinerary.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    activity: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    tags: [{ type: String }],
}, { _id: false }); // No need for unique IDs for nested schema

const itinerarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    activities: [activitySchema],
    dateRange: {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);