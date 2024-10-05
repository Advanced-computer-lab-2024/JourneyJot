/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itinerarySchema = new Schema(
  {
    title: { type: String, required: true },
    activities: [{ type: String, required: true }],
    locations: [{ lat: Number, lng: Number }],
    timeline: { type: String },
    duration: { type: String, required: true },
    language: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    availableDates: [{ type: Date, default: [] }],
    accessibility: { type: Boolean, default: false },
    pickupLocation: { type: String, required: true },
    dropOffLocation: { type: String, required: true },
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = Itinerary;

// // models/Itinerary.js
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Define the Itinerary schema
// const ItinerarySchema = new Schema({
//   tourGuide: { type: Schema.Types.ObjectId, ref: "TourGuide", required: true }, // Reference to the Tour Guide
//   title: { type: String, required: true },
//   activities: [
//     {
//       description: { type: String, required: true },
//       location: { type: String, required: true },
//       date: { type: Date, required: true },
//     },
//   ],
//   dateRange: {
//     start: { type: Date, required: true },
//     end: { type: Date, required: true },
//   },
//   tags: { type: [String], default: [] }, // Array of tags for categorization
// });

// // Create the Itinerary model
// const Itinerary = mongoose.model("Itinerary", ItinerarySchema);

// module.exports = Itinerary;
