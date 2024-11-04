/** @format */

const bcrypt = require('bcrypt'); // Import bcrypt for password hashing and comparison
const Tourist = require('../models/Tourist'); // Import the Tourist model

// Change Password Controller
exports.changePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body; // Destructure the request body
	const id = req.user._id; // Get the user ID from the authenticated request

	try {
		// Find the tourist by ID
		const tourist = await Tourist.findById(id);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Check if the current password matches
		const isMatch = await bcrypt.compare(currentPassword, tourist.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Incorrect current password' });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		tourist.password = hashedPassword; // Update the tourist's password
		await tourist.save(); // Save the changes

		// Send success response
		return res.status(200).json({ message: 'Password changed successfully' });
	} catch (error) {
		console.error('Error changing password:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};
