const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ''

    },

    // ... other fields specific to Activity
    createdBy: {
        type: String,
        // mongoose.Schema.Types.ObjectId,
        // ref: 'TourGuide', // Assuming only Tour Guides create activities
        // ADMIN CAN CREATE AN ACTIVITY
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


ActivitySchema.pre('save', function (next) {
    this.updatedAt = Date.now(); // Update updatedAt to the current date
    next();
});


module.exports = mongoose.model('Activity', ActivitySchema);
