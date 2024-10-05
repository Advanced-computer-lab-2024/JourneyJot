const advertiserModel = require('../models/Advertiser.js');

const createAdvertiser = async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;

    // Check if the advertiser already exists
    const existingAdvertiser = await advertiserModel.findOne({ $or: [{ Username }, { Email }] });
    if (existingAdvertiser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Create a new user instance
    const newUser = new advertiserModel({ 
      Username, 
      Email, 
      Password
    });

    // Save the user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'Advertiser created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating Advertiser:', error);
    res.status(500).json({ message: 'Error creating Advertiser', error: error.message });
  }
};

module.exports = { createAdvertiser };
