// models/Tourist.js

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
      balance: { type: Number, default: 0 },
      currency: { type: String, default: 'EGP' }, // Updated to EGP
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    redeemablePoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    itineraries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" }],
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    attractions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attraction" }],
  },
  { timestamps: true }
);

// Method to redeem points and add cash to the wallet
touristSchema.methods.redeemPoints = function () {
  const conversionRate = 100; // 10,000 points = 100 EGP
  const pointsPerUnitCash = 10000;

  // Calculate the amount to add to wallet balance based on redeemable points
  const redeemableCash = Math.floor(this.redeemablePoints / pointsPerUnitCash) * conversionRate;

  if (redeemableCash > 0) {
    this.wallet.balance += redeemableCash;
    this.redeemablePoints -= Math.floor(this.redeemablePoints / pointsPerUnitCash) * pointsPerUnitCash;
  }

  return this.save();
};

module.exports = mongoose.model("Tourist", touristSchema);
