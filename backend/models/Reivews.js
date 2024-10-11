const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    reviewer: {
      type: String,
      required: false,
    },
    comment: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
