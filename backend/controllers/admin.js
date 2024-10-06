/** @format */

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.deleteAccount = async (req, res) => {
	try {
		const userId = req.params.userId;

		// Find the user by ID and delete them
		const deletedUser = await User.findByIdAndDelete(userId);

		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Delete the user's tour guide profile if they exist

		res
			.status(200)
			.json({ message: 'Account deleted successfully', data: deletedUser });
	} catch (error) {
		console.error('Error deleting account:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.addGovernor = async (req, res) => {
	const { username, password, email } = req.body;

	// Check if username or password is missing
	if (!username || !password) {
		return res
			.status(400)
			.json({ message: 'Username and password are required' });
	}

	try {
		// Check if a user with this username already exists
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ message: 'Username already exists' });
		}

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new governor user
		const newGovernor = new User({
			email,
			username,
			password: hashedPassword,
			role: 'governor', // Setting the role to governor
		});

		// Save the new governor user
		await newGovernor.save();
		const token = jwt.sign(
			{ _id: newGovernor._id, role: newGovernor.role },
			'cr7'
		);
		console.log('Token for new Governor:', token);

		res.status(201).json({ message: 'Tourism Governor created successfully' });
	} catch (error) {
		console.error('Error creating governor:', error);
		res.status(500).json({ message: 'Server error' });
	}
};
exports.addAdmin = async (req, res) => {
	const { username, password, email } = req.body;

	// Check if username or password is missing
	if (!username || !password) {
		return res
			.status(400)
			.json({ message: 'Username and password are required' });
	}

	try {
		// Check if a user with this username already exists
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ message: 'Username already exists' });
		}

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new governor user
		const newAdmin = new User({
			email,
			username,
			password: hashedPassword,
			role: 'admin', // Setting the role to governor
		});

		// Save the new governor user
		await newAdmin.save();

		res.status(201).json({ message: 'Admin created successfully' });
	} catch (error) {
		console.error('Error creating Admin:', error);
		res.status(500).json({ message: 'Server error' });
	}
};
