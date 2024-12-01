const mongoose = require('mongoose');

const PreferenceTagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        // unique: true, // Ensures that each tag is unique
    },
    description: {
        type: String,
        default: '',
    },
    createdBy: {
        type: String,
        // mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin',
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the date when created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the date when updated
    }
});

// Middleware to update updatedAt field
PreferenceTagSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('PreferenceTag', PreferenceTagSchema);
