const bcrypt = require("bcryptjs");
const Tourist = require("../models/Tourist");
const Advertiser = require("../models/Advertiser");
const TourGuide = require("../models/TourGuide");
const Seller = require("../models/Seller");
const TourismGovernor = require("../models/TourismGovernor");
const Admin = require("../models/Admin");

// Controller to delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userType = req.params.userType.toLowerCase(); // Convert to lowercase for consistency

    let userModel;
    switch (userType) {
      case "tourist":
        userModel = Tourist;
        break;
      case "advertiser":
        userModel = Advertiser;
        break;
      case "tourguide":
        userModel = TourGuide;
        break;
      case "seller":
        userModel = Seller;
        break;
      case "tourismgovernor":
        userModel = TourismGovernor;
        break;
      case "admin":
        userModel = Admin;
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: `${userType} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to add a Tourism Governor
exports.addTourismGovernor = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await TourismGovernor.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new Tourism Governor
    const newGovernor = new TourismGovernor({
      username,
      password: hashedPassword,
      // ... any other fields you might have
    }); ///do this or not?

    await newGovernor.save();

    res.status(201).json({ message: "Tourism Governor created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide a username and password" });
    }

    // Check if username already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new Admin
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      // ... any other fields you might have
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
