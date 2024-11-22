/** @format */

const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Generate OTP
function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Request OTP Route
exports.requestOTP = async (req, res) => {
	const { email } = req.body;

	try {
		// Find the user
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).send('User not found');
		}

		// Generate OTP and expiry
		const otp = generateOTP();
		const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

		// Update user record with OTP and expiry
		user.otp = otp;
		user.otpExpiresAt = otpExpiry;
		await user.save(); // Save the OTP and expiry to the database

		// Create a transporter for sending the email
		const transporter = nodemailer.createTransport({
			service: 'gmail', // Replace with your email provider
			auth: {
				user: process.env.USER_EMAIL, // Use environment variables for email credentials
				pass: process.env.USER_PASS, // Use environment variables for email password
			},
		});

		const mailOptions = {
			from: process.env.USER_EMAIL, // Use the environment variable here too
			to: email,
			subject: 'Your OTP for Password Reset',
			text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
		};

		// Send email with OTP
		await transporter.sendMail(mailOptions); // Wait for the email to be sent
		res.send('OTP sent to your email');
	} catch (error) {
		console.error('Error during OTP request:', error);
		res.status(500).send('Internal Server Error');
	}
};

exports.verifyOTP = async (req, res) => {
	const { email, otp } = req.body;

	// Find the user
	const user = await User.findOne({ email });
	if (!user) return res.status(404).send('User not found');

	// Check OTP and expiry
	if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
		return res.status(400).send('Invalid or expired OTP');
	}

	res.send('OTP verified successfully');
};

exports.resetPassword = async (req, res) => {
	const { email, newPassword } = req.body;

	// Find the user
	const user = await User.findOne({ email });
	if (!user) return res.status(404).send('User not found');

	// Verify OTP

	// Hash the new password
	const hashedPassword = await bcrypt.hash(newPassword, 10);
	console.log(user);
	console.log(hashedPassword);

	// Update user's password
	user.password = hashedPassword;
	user.otp = null; // Clear the OTP
	user.otpExpiresAt = null;
	await user.save();

	res.send('Password reset successfully');
};