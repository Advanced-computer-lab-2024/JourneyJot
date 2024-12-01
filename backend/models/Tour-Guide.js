/** @format */

const mongoose = require("mongoose");

// Create a sub-schema for the Tour Guide Profile
const tourGuideProfileSchema = new mongoose.Schema({
<<<<<<< HEAD
	mobileNumber: {
		type: String,
		trim: true,
		required: [true, 'Mobile number is required'],
		match: /^\d{11}$/,
	},
	yearsOfExperience: {
		type: Number,
		required: [true, 'Years of experience is required'],
	},
	previousWork: {
		type: String,
		trim: true,
		required: [false, 'Previous work experience is not required'],
	},
	image: {
		type: String, // Image is stored as a string URL in MongoDB
		default: null, // Default image is null if no image is provided
	},
	file: {
		type: String, // File is stored as a string URL in MongoDB
		default: null, // Default file is null if no file is provided
	},
	totalRating: { type: Number, default: 0 },       // Total sum of all ratings
    ratingCount: { type: Number, default: 0 },       // Number of ratings received
    averageRating: {                                 // Average rating
        type: Number,
        default: 0,
        min: 1,
        max: 5
    },
	comments: [
        {
            text: { type: String, required: true },
            tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now }
        }
    ]
=======
  mobileNumber: {
    type: String,
    trim: true,
    required: [true, "Mobile number is required"],
    match: /^\d{11}$/,
  },
  yearsOfExperience: {
    type: Number,
    required: [true, "Years of experience is required"],
  },
  previousWork: {
    type: String,
    trim: true,
    required: [false, "Previous work experience is not required"],
  },
  image: {
    type: String, // Image is stored as a string URL in MongoDB
    default: null, // Default image is null if no image is provided
  },
  file: {
    type: String, // File is stored as a string URL in MongoDB
    default: null, // Default file is null if no file is provided
  },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
      rating: { type: Number, required: true },
      comment: { type: String },
    },
  ],
>>>>>>> 20bb5995be499fabe711c575e266d95309281269
});
const TourGuideProfile = mongoose.model(
  "TourGuideProfile",
  tourGuideProfileSchema
);

module.exports = TourGuideProfile;
