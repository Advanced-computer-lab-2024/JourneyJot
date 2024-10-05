const mongoose = require("mongoose");

const HistoricalPlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourismGovernor", // Assuming Tourism Governors create historical places
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pictures: {
      type: [String],
      required: true,
    },
    openingHours: {
      type: Number,
      required: true,
    },
    ticketPrices: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HistoricalPlace", HistoricalPlaceSchema);
