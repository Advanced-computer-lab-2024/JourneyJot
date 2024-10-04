const touristModel = require('../models/Tourist.js');
const mongoose = require('mongoose');

const createTourist = async (req, res) => {
  try {
    const { Username, Email, Password, MobileNumber, Nationality, DOB, JobOrStudent } = req.body;

    // Create a new user instance
    const newUser = new touristModel({ 
      Username, 
      Email, 
      Password, 
      MobileNumber, 
      Nationality, 
      DOB, 
      JobOrStudent 
    });

    // Save the user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'Tourist created successfully', user: newUser });
  } catch (error) {
    // Handle validation errors or other issues
    console.error('Error creating Tourist:', error);
    res.status(500).json({ message: 'Error creating tourist', error: error.message });
  }
};


const GetTouristInfo = async (req, res) => {
    try {
      const { Email } = req.body; // Get the tourist email from the request body
  
      // Find the tourist by email
      const tourist = await touristModel.findOne({Email});
  
      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }
  
      // Send the tourist info in the response
      res.status(200).json({ message: 'Tourist information retrieved successfully', user: tourist });
    } catch (error) {
      // Handle errors
      console.error('Error retrieving tourist info:', error);
      res.status(500).json({ message: 'Error retrieving tourist info', error: error.message });
    }
  };

  
  const updateTouristInfo = async (req, res) => {
    try {
      const { Username, Email, Password, MobileNumber, Nationality, JobOrStudent } = req.body;
  
      // Validate required field to identify the tourist
      if (!Username) {
        return res.status(400).json({ message: 'Username is required to identify the tourist.' });
      }
  
      // Prepare update data object
      const updateData = {};
      if (Email) updateData.Email = Email;
      if (Password) updateData.Password = Password;
      if (MobileNumber) updateData.MobileNumber = MobileNumber;
      if (Nationality) updateData.Nationality = Nationality;
      if (JobOrStudent) updateData.JobOrStudent = JobOrStudent;
  
      // Check if there are fields to update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'At least one field to update is required (Email, Password, MobileNumber, Nationality, or JobOrStudent).' });
      }
  
      // Find the tourist by Username and update with new data
      const tourist = await touristModel.findOneAndUpdate({ Username }, updateData, { new: true });
  
      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }
  
      // Send the updated tourist info in the response
      res.status(200).json({ message: 'Tourist information updated successfully', user: tourist });
    } catch (error) {
      // Handle errors
      console.error('Error updating tourist info:', error);
      res.status(500).json({ message: 'Error updating tourist info', error: error.message });
    }
  };
  
  
  
  
  
  
  
module.exports = { createTourist , GetTouristInfo , updateTouristInfo};
