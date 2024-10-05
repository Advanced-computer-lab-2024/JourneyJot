// models/Advertiser.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Advertiser schema
const AdvertiserSchema = new Schema(
  {
    companyName: { type: String, required: true },
    website: { type: String, required: true },
    hotline: { type: String, required: true },
    companyProfile: { type: String, default: "" },
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

// Create the Advertiser model
const Advertiser = mongoose.model("Advertiser", AdvertiserSchema);

module.exports = Advertiser;
