const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const museumSchema = new Schema(
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

const Museum = mongoose.model("Museum", museumSchema);
module.exports = Museum;
