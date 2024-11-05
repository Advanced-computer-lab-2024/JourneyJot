/** @format */

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to create initial admin
exports.initialAdmin = async () => {
	try {
		// Check if admin already exists
		const adminExists = await User.findOne({
			username: 'gando',
			role: 'admin',
		});

		if (!adminExists) {
			// Hash the default password
			const hashedPassword = await bcrypt.hash('gando', 10);

			// Create the initial admin user with only username and password
			const admin = new User({
				username: 'gando',
				password: hashedPassword,
				role: 'admin', // Set role to 'admin'
			});

			// Save the admin user
			await admin.save();
			console.log('Initial admin "gando" created');
		} else {
			console.log('Initial admin already exists');
		}
	} catch (error) {
		console.error('Error creating initial admin:', error);
	}
};

exports.deleteAccount = async (req, res) => {
	const { username } = req.params; // Get the username from the request params

	try {
		// Find and delete the user by username
		const user = await User.findOneAndDelete({ username });

		if (!user) {
			// If no user is found, return a 404 error
			return res.status(404).json({ message: 'User not found' });
		}

		// Successfully deleted the user
		return res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		// Catch any errors during the deletion process
		return res.status(500).json({ message: error.message });
	}
};

exports.addGovernor = async (req, res) => {
	const { username, password } = req.body;

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
	const { username, password } = req.body;

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
exports.getPendingUsers = async (req, res) => {
	try {
		const users = await User.find({ registrationStatus: 'pending' });
		res.status(200).json(users);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error retrieving users', error: error.message });
	}
};

exports.updateUserStatus = async (req, res) => {
	try {
		const { userId } = req.params;
		const { status } = req.body;
		const user = await User.findById(userId);

		if (!user) return res.status(404).json({ message: 'User not found' });

		user.registrationStatus = status;
		await user.save();

		res.status(200).json({ message: `User status updated to ${status}`, user });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error updating user status', error: error.message });
	}
};
