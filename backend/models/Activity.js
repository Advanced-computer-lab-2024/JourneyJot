/** @format */

// models/Activity.js

const mongoose = require("mongoose");
const activitySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String, // 'Point'
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    priceRange: {
      type: String,
      required: false, // If you want it to be optional
    },
    category: {
      type: [String],
      required: true, // Category like 'food', 'concert', etc.
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag", // Reference to the Tags model
        required: false,
      },
    ],
    specialDiscounts: {
      type: String,
      required: false,
    },
    bookingOpen: {
      type: Boolean,
      default: true,
    },
    advertiserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
