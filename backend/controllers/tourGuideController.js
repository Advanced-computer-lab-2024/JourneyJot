const Activity = require('../models/Activity');
const Itinerary = require('../models/Itinerary');
const TourGuide = require('../models/TourGuide');

exports.getMyActivities = async (req, res) => {
    try {
        // Ensure the user is a Tour Guide
        if (req.user.userType !== 'tourguide') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const activities = await Activity.find({ createdBy: req.user.id });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyItineraries = async (req, res) => {
    try {
        // Ensure the user is a Tour Guide
        if (req.user.userType !== 'tourguide') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const itineraries = await Itinerary.find({ createdBy: req.user.id });
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getProfile = async (req, res) => {
  try {
    // Ensure the user is a Tour Guide
    if (req.user.userType !== 'tourguide') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tourGuide = await TourGuide.findById(req.user.id).select('-password');
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour Guide not found' });
    }

    res.status(200).json(tourGuide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const { validationResult } = require('express-validator');

exports.updateProfile = async (req, res) => {
  try {
    // Ensure the user is a Tour Guide
    if (req.user.userType !== 'tourguide') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, mobileNumber, yearsOfExperience, previousWork, bio, profileImage } = req.body;

    const updatedFields = {
      fullName,
      mobileNumber,
      yearsOfExperience,
      previousWork,
      bio,
      profileImage,
    };

    const tourGuide = await TourGuide.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(tourGuide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Compare this snippet from backend/routes/adminRoutes.js:
