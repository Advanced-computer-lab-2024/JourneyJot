/** @format */

// controllers/advertiser.js
const User = require('../models/User');

exports.createAdvertiserProfile = async (req, res) => {
	const { website, hotline, companyProfile } = req.body;

	try {
		const user = await User.findById(req.user._id);

		if (user.role !== 'advertiser') {
			return res
				.status(403)
				.json({ message: 'Access denied. Not an advertiser.' });
		}

		user.advertiserProfile = {
			website,
			hotline,
			companyProfile,
		};

		await user.save();
		res.status(200).json({
			message: 'Advertiser profile created successfully',
			advertiserProfile: user.advertiserProfile,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getAdvertiserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user || user.role !== 'advertiser') {
			return res
				.status(403)
				.json({ message: 'Access denied. Not an advertiser.' });
		}

		res.json({ advertiserProfile: user.advertiserProfile });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

// Add update function similarly
