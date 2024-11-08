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
        default: 0, // Default balance set to 0
      },
      currency: {
        type: String,
        default: "USD", // Default currency set to USD
      },
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
      },
    ],
    itineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary", // Reference to the Itinerary model
      },
    ],
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity", // Reference to the Activity model
      },
    ],
    attractions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attraction", // Reference to the Attraction model
      },
    ],
    points: {
      type: Number,
      default: 0, // Default balance set to 0

    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tourist", touristSchema);
