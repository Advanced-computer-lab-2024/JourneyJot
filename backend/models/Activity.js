const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    // ... other fields specific to Activity
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourGuide', // Assuming only Tour Guides create activities
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Activity', ActivitySchema);
