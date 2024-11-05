/** @format */

const User = require('../models/User'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Change Password Controller
exports.changePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body; // Destructure the request body
	const id = req.user._id; // Get the user ID from the authenticated request
	try {
		const user = await User.findById(id); // Find the user by ID
		if (!user) {
			return res.status(404).json({ message: 'User not found' }); // Return 404 if user not found
		}
		const isMatch = await bcrypt.compare(currentPassword, user.password); // Compare current password
		if (!isMatch) {
			return res.status(400).json({ message: 'Incorrect current password' }); // Return 400 if current password is incorrect
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
		user.password = hashedPassword; // Update the user's password
		await user.save(); // Save the user with the new password
		return res.status(200).json({ message: 'Password changed successfully' }); // Return success message
	} catch (error) {
		console.error('Error changing password:', error); // Log the error
		return res.status(500).json({ message: 'Server error' }); // Return 500 for server error
	}
};
