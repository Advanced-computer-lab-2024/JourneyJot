/** @format */

const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Configure storage for uploaded files
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../uploads')); // Store files in 'uploads' folder
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

// Define allowed file types for upload
const allowedFileTypes = /pdf|doc|docx|txt/;

// Multer configuration to upload files with specific extensions and size limit
const uploadFile = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
	fileFilter: (req, file, cb) => {
		const isFileTypeAllowed =
			allowedFileTypes.test(path.extname(file.originalname).toLowerCase()) &&
			allowedFileTypes.test(file.mimetype);
		if (isFileTypeAllowed) {
			cb(null, true);
		} else {
			cb(new Error('Only .pdf, .doc, .docx, or .txt files are allowed!'));
		}
	},
});

/**
 * Middleware to handle file upload and associate it with a user's profile.
 */
const uploadFiles = async (req, res) => {
	try {
		// Ensure the user exists
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Ensure a file was uploaded
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}

		// Update the user's profile file path based on their role
		switch (user.role) {
			case 'tour_guide':
				user.tourGuideProfile.file = req.file.filename;
				break;
			case 'advertiser':
				user.advertiserProfile.file = req.file.filename;
				break;
			case 'seller':
				user.sellerProfile.file = req.file.filename;
				break;
			default:
				return res
					.status(403)
					.json({ message: 'Invalid user role for file upload' });
		}

		// Save changes to the user document
		await user.save();
		return res.status(200).json({ filename: req.file.filename });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Error uploading file' });
	}
};

module.exports = { uploadFile, uploadFiles };
