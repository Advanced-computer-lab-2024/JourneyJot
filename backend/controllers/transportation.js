/** @format */

// controllers/transportation.js

const Transportation = require('../models/Transportation');

// List all active transportation options
exports.listTransportation = async (req, res) => {
	try {
		const transportOptions = await Transportation.find({ isArchived: false });
		res.status(200).json(transportOptions);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.createTransportation = async (req, res) => {
	try {
		// Assuming req.user._id is populated from auth middleware as the advertiser ID
		const transportation = new Transportation({
			advertiser: req.user._id, // Automatically set to the authenticated user
			...req.body, // Spread the rest of req.body data into the new transportation document
		});

		await transportation.save();
		return res
			.status(201)
			.json({ message: 'Transportation created successfully', transportation });
	} catch (error) {
		console.error('Error creating transportation:', error);
		return res
			.status(500)
			.json({ message: 'Error creating transportation', error });
	}
};
