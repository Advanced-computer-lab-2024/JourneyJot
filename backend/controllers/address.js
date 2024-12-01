/** @format */

const Address = require('../models/Address');

exports.addAddress = async (req, res) => {
	try {
		const { address, city, state, zip, country } = req.body;

		// Basic validation
		if (!address || !city || !state || !zip || !country) {
			return res.status(400).json({ error: 'All fields are required.' });
		}

		const newAddress = new Address({
			userId: req.user._id, // Extracted from token
			address,
			city,
			state,
			zip,
			country,
		});

		await newAddress.save();
		res
			.status(201)
			.json({ message: 'Address added successfully', address: newAddress });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getAddress = async (req, res) => {
	try {
		const addresses = await Address.find({ userId: req.user._id });

		if (addresses.length === 0) {
			return res
				.status(404)
				.json({ message: 'No addresses found for this user.' });
		}

		res.status(200).json(addresses);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
