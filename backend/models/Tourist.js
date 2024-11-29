/** @format */

const mongoose = require("mongoose");
const helperMethods = require("../helper/methods");

const touristSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\d{10,15}$/, "Please enter a valid mobile number"],
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
      validate: {
        validator: function (value) {
          return helperMethods.calculateAge(value) > 18;
        },
        message: "You must be 18 years or older to register",
      },
    },
    occupation: {
      type: String,
      enum: ["Job", "Student"],
      required: [true, "Occupation is required"],
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference to the Product model
    ],

    itineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    attractions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attraction",
      },
    ],
    points: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "pending_deletion", "deleted"],
      default: "active",
    },
    role: { type: String, enum: ["tourist"] },
    transportations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transportation" },
    ],
    flights: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flight" }],
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Tourist", touristSchema);
