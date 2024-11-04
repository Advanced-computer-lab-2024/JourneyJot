/** @format */

const multer = require('multer');
const path = require('path');
const User = require('../models/User');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../images'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const upload = multer({ storage });

const uploadImages = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

		// Check the user's role and update the corresponding profile image field
		if (user.role === 'tour_guide') {
			user.tourGuideProfile.image = req.file.filename;
		} else if (user.role === 'advertiser') {
			user.advertiserProfile.image = req.file.filename; // Adjust according to your advertiser profile structure
		} else if (user.role === 'seller') {
			user.sellerProfile.image = req.file.filename; // Adjust according to your advertiser profile structure
		} else {
			return res
				.status(403)
				.json({ message: 'Invalid user role for image upload' });
		}

		await user.save();
		return res.status(200).json({ filename: req.file.filename });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Error uploading file' });
	}
};

module.exports = { upload, uploadImages };
