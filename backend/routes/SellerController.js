const sellerModel = require('../models/Seller.js');

const createSeller = async (req, res) => {
  try {
    const { Username, Email, Password , Description} = req.body;

    // Check if the seller already exists
    const existingSeller = await sellerModel.findOne({ $or: [{ Username }, { Email }] });
    if (existingSeller) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Create a new seller instance
    const newUser = new sellerModel({ 
      Username, 
      Email, 
      Password,
      Description
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
const GetSellerInfo = async (req, res) => {
  try {
    const { Email } = req.body; // Get the seller email from the request body

    // Find the seller by email
    const Seller = await sellerModel.findOne({Email});

    if (!Seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Send the tourist info in the response
    res.status(200).json({ message: 'Seller information retrieved successfully', user: Seller });
  } catch (error) {
    // Handle errors
    console.error('Error retrieving seller info:', error);
    res.status(500).json({ message: 'Error retrieving tourist info', error: error.message });
  }
};

const updateSellerInfo = async (req, res) => {
  try {
    const { Username, Email, Password, Description } = req.body;

    // Validate required field to identify the seller
    if (!Username) {
      return res.status(400).json({ message: 'Username is required to identify the seller.' });
    }

    // Prepare update data object
    const updateData = {};
    if (Email) updateData.Email = Email; 
    if (Password) updateData.Password = Password; 
    if (Description) updateData.Description = Description; 
    // Check if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'At least one field to update is required (Email, Password, Description).' });
    }

    // Find the seller by Username and update with new data
    const Seller = await sellerModel.findOneAndUpdate({ Username }, updateData, { new: true });

    if (!Seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    // Send the updated seller info in the response
    res.status(200).json({ message: 'Seller information updated successfully.', user: Seller });
  } catch (error) {
    // Handle errors
    console.error('Error updating seller info:', error);
    res.status(500).json({ message: 'Error updating seller info.' });
  }
};

module.exports = { createSeller,GetSellerInfo,updateSellerInfo };
