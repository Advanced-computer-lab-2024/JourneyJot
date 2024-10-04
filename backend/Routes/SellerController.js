const sellerModel = require('../models/Seller.js');

const createSeller = async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;

    // Check if the seller already exists
    const existingSeller = await sellerModel.findOne({ $or: [{ Username }, { Email }] });
    if (existingSeller) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Create a new seller instance
    const newUser = new sellerModel({ 
      Username, 
      Email, 
      Password
    });

    // Save the seller to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'Seller created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating Seller:', error);
    res.status(500).json({ message: 'Error creating Seller', error: error.message });
  }
};

module.exports = { createSeller };
