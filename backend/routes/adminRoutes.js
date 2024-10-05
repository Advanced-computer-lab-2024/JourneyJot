/** @format */

const express = require('express');
const router = express.Router();
const Admin = require('..//models//Admin');
const { deleteUserByType, addAdmin, addTourismGovernor } = require('..//controllers//adminController');
const verifyAdmin = require('..//middlewares//authMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Temporary route to create the first admin
router.post('/create-first-admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Ensure there are no admins in the system
    const existingAdmins = await Admin.countDocuments();
    if (existingAdmins > 0) {
      return res.status(400).json({ message: 'Admin already exists. This route is disabled.' });
    }

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide a username and password' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the first admin
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      fullName: "First Admin",
      email: "admin@example.com"
    });

    await newAdmin.save();
    res.status(201).json({ message: 'First admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Temporary login route to get a token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a token (with the admin's _id)
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send back the token
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Create a new admin
router.post('/admin', verifyAdmin,addAdmin);
// Create a new Tourism Governor
router.post('/tourism-governor', verifyAdmin,addTourismGovernor);
// Define the delete route
router.delete('//:userType//:userId', verifyAdmin, deleteUserByType);

console.log('addAdmin function:', addAdmin);
console.log('addTourismGovernor function:', addTourismGovernor);
console.log('deleteUserByType function:', deleteUserByType);


module.exports = router;
