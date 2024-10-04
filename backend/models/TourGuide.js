const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
  Username: {
    type: String,
    required: true,
    unique: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
  }
}, { timestamps: true });

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
module.exports = TourGuide;
