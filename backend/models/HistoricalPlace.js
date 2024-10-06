const mongoose = require('mongoose');

const HistoricalPlaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: String,
    // ... other fields specific to HistoricalPlace
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourismGovernor', // Assuming Tourism Governors create historical places
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tags: { 
        type: [String] 

    },
});

module.exports = mongoose.model('HistoricalPlace', HistoricalPlaceSchema);
