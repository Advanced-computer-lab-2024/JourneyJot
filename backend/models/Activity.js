/** @format */

const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: String,
    location: String,
    price: {
        type: Number,
        required: true,
    },
    category: String,
    tags: [String],
    specialDiscounts: String,
    bookingOpen: Boolean,
    ratings: {
        type: Number,
        default: 0, // Default value if no rating is provided
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Activity', ActivitySchema);



