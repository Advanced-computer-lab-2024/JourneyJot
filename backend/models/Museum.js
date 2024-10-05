const mongoose = require("mongoose");

const MuseumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourismGovernor", // Assuming Tourism Governors create museums
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
      type: [String], //ex:{link.jpg kda}
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

module.exports = mongoose.model("Museum", MuseumSchema);
