/** @format */
const User = require("../models/User");
const TourGuide = require("../models/Tour-Guide");
exports.createTourGuideProfile = async (req, res) => {
  const { mobileNumber, yearsOfExperience, previousWork } = req.body;

  try {
    const user = await User.findById(req.user._id);
    console.log("User found:", user); // Log the user object

    if (user.role !== "tour_guide") {
      return res
        .status(403)
        .json({ message: "Access denied. Not a tour guide." });
    }

    user.tourGuideProfile = {
      ...user.tourGuideProfile, // Retain existing fields
      mobileNumber: mobileNumber || user.tourGuideProfile.mobileNumber,
      yearsOfExperience:
        yearsOfExperience || user.tourGuideProfile.yearsOfExperience,
      previousWork: previousWork || user.tourGuideProfile.previousWork, // Optional field
    };

    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      tourGuideProfile: user.tourGuideProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTourGuideProfile = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    console.log("User found for profile:", user); // Log the user object

    if (!user || user.role !== "tour_guide") {
      return res
        .status(403)
        .json({ message: "Access denied. Not a tour guide." });
    }

    res.json({ tourGuideProfile: user.tourGuideProfile });
  } catch (error) {
    console.error("Error retrieving profile:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTourGuideProfileById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    console.log("User found for profile:", user); // Log the user object
    if (!user || user.role !== "tour_guide") {
      return res
        .status(403)
        .json({ message: "Access denied. Not a tour guide." });
    }
    res.json({ tourGuideProfile: user.tourGuideProfile });
  } catch (error) {
    console.error("Error retrieving profile:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
};

exports.addRatingAndComment = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const tourGuideId = req.params.id; // Assuming the tour guide ID is passed in the route parameters
    const userId = req.user._id; // Assuming user is authenticated and `req.user` is populated

    // Find the TourGuideProfile and populate `userId` within `ratings`
    const TourGuide = await TourGuide.findById(tourGuideId);

    if (!TourGuide) {
      return res.status(404).json({ message: "Tour Guide not found." });
    }

    // Add the new rating to the ratings array
    TourGuide.ratings.push({ userId, rating, comment });
    await TourGuide.save();

    // Populate `userId` field after saving (populate can be done here on-the-fly)
    await TourGuide.populate({
      path: "ratings.userId",
      select: "email username", // Fetching the email and username of the user who left the rating
    });

    res.status(200).json({
      message: "Rating and comment added successfully!",
      TourGuide,
    });
  } catch (error) {
    console.error("Error adding rating and comment:", error.message);
    res.status(400).json({ error: error.message });
  }
};
