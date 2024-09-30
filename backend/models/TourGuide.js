const mongoose = require('mongoose');

const TourGuideSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // New fields
  fullName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
  },
  previousWork: {
    type: String,
  },
  bio: {
    type: String,
  },
  profileImage: {
    type: String, // URL or path to the profile image
  },
  // ... any other fields
}, { timestamps: true });

module.exports = mongoose.model('TourGuide', TourGuideSchema);
