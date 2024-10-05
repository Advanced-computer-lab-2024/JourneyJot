const mongoose = require('mongoose');

const MuseumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: String,
    // ... other fields specific to Museum
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourismGovernor', // Assuming Tourism Governors create museums
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Museum', MuseumSchema);
