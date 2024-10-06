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
const productSchema = new Schema(
  {
    picture: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },

    details: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
