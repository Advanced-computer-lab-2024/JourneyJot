const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historicalPlaceSchema = new Schema(
  {
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

const HistoricalPlace = mongoose.model(
  "HistoricalPlace",
  historicalPlaceSchema
);
module.exports = HistoricalPlace;
