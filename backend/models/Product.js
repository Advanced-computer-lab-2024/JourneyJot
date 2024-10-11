const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review", // Reference to the Review model
      required: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
