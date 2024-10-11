/** @format */

const mongoose = require("mongoose");

const preferenceTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("PreferenceTag", preferenceTagSchema);
