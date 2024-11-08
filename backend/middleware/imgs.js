/** @format */

// middleware/uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// Configure storage for multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../photos')); // Specify the upload directory
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname)); // Set filename to current timestamp + extension
	},
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
	// Accept images with .jpg, .jpeg, .png, or .gif extensions
	const allowedFileTypes = /jpeg|jpg|png|gif/;
	const extname = allowedFileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedFileTypes.test(file.mimetype);

	if (extname && mimetype) {
		return cb(null, true); // Accept the file
	} else {
		return cb(
			new Error('Only image files (JPEG, PNG, GIF) are allowed!'),
			false
		); // Reject the file
	}
};

// Multer setup with limits and file filter
const upload = multer({
	storage: storage,
	fileFilter: fileFilter, // Add the file filter
	limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

module.exports = upload;
