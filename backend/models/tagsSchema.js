const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensure tags are unique
    },
    type: {
      type: String,
      required: true, // Type of the historical location
    },
    historicalPeriod: {
      type: String,
      required: true, // E.g., "Renaissance", "Ancient", etc.
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
