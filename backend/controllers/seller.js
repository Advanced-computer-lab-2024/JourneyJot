/** @format */

// controllers/seller.js
const User = require('../models/User');

exports.createSellerProfile = async (req, res) => {
	const { name, description } = req.body;

	try {
		const user = await User.findById(req.user._id);

		if (user.role !== 'seller') {
			return res.status(403).json({ message: 'Access denied. Not a seller.' });
		}

		user.sellerProfile = {
			name,
			description,
		};

		await user.save();
		res.status(200).json({
			message: 'Seller profile created successfully',
			sellerProfile: user.sellerProfile,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getSellerProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user || user.role !== 'seller') {
			return res.status(403).json({ message: 'Access denied. Not a seller.' });
		}

		res.json({ sellerProfile: user.sellerProfile });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

// Add update function similarly
