const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Profile schema
const TourGuideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    experience: { type: Number, required: true },
    previousWork: { type: String, default: "" },
    accepted: { type: Boolean, default: false },

    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the Profile model
const TourGuide = mongoose.model("TourGuide", TourGuideSchema);

module.exports = TourGuide;
