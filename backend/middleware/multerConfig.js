/** @format */

const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 * 10 },
	fileFilter: function (req, file, cb) {
		const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
		const extname = allowedTypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = allowedTypes.test(file.mimetype);
		if (extname && mimetype) {
			cb(null, true);
		} else {
			cb(new Error('Only documents and images are allowed!'));
		}
	},
});

module.exports = upload;
