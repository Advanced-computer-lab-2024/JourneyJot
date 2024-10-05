const bcrypt = require('bcryptjs');
const Admin = require('..//models//Admin');
const Tourist = require('..//models//Tourist');
const Advertiser = require('..//models//Advertiser');
const TourGuide = require('..//models//TourGuide');
const Seller = require('..//models//Seller');
const TourismGovernor = require('..//models//TourismGovernor');



const addAdmin = async (req, res) => {
    console.log('Add Admin route hit');
    try {
        const { username, password, fullName, email } = req.body;

        // Validate input
        if (!username || !password || !fullName || !email) {
            return res.status(400).json({ message: 'Please provide username, password, fullName, and email' });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Check if username or email already exists
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Admin
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            fullName,
            email,
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



// Updated deleteUser controller function in adminController.js
const deleteUserByType = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userType = req.params.userType.toLowerCase(); // Convert to lowercase for consistency

        let userModel;
        switch (userType) {
            case 'tourist':
                userModel = Tourist;
                break;
            case 'advertiser':
                userModel = Advertiser;
                break;
            case 'tourguide':
                userModel = TourGuide;
                break;
            case 'seller':
                userModel = Seller;
                break;
            case 'tourismgovernor':
                userModel = TourismGovernor;
                break;
            case 'admin':
                userModel = Admin;
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: `${userType} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};




// Controller function to add a new tourism governor
const addTourismGovernor = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide a username and password' });
    }

    // Check if username already exists
    const existingGovernor = await TourismGovernor.findOne({ username });
    if (existingGovernor) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Tourism Governor with default values for other fields
    const newGovernor = new TourismGovernor({
      username,
      password: hashedPassword,  // Store the hashed password
    });

    await newGovernor.save();

    res.status(201).json({ message: 'Tourism Governor created successfully', newGovernor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
    deleteUserByType,
    addAdmin,
    addTourismGovernor,
  };
  