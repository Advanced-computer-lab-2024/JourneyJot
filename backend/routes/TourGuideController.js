const tourGuideModel = require('../models/TourGuide.js');

const createTourGuide = async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;

    // Check if the Tour Guide already exists
    const existingTourGuide = await tourGuideModel.findOne({ $or: [{ Username }, { Email }] });
    if (existingTourGuide) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Create a new Tour guide instance
    const newUser = new tourGuideModel({ 
      Username, 
      Email, 
      Password
    });

    // Save the Tour guide to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'Tour Guide created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating Tour Guide:', error);
    res.status(500).json({ message: 'Error creating Tour Guide', error: error.message });
  }
};

module.exports = { createTourGuide };
