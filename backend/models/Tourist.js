const mongoose = require("mongoose");
const moment = require("moment"); // For handling date validations

const TouristSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      immutable: true, // Prevent username from being changed after creation
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      immutable: true, // Prevent DOB from being changed after creation
      validate: {
        validator: function (value) {
          // Ensure the user is 18 years or older
          return moment().diff(value, "years") >= 18;
        },
        message: "You must be at least 18 years old to register.",
      },
    },
    jobOrStudent: {
      type: String,
      enum: ["job", "student"], // Allow only 'job' or 'student' values
      required: true,
    },
    wallet: {
      type: Number,
      required: true,
      default: 0, // Default value for wallet
      immutable: true, // Prevent wallet from being changed after creation
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tourist", TouristSchema);
