/** @format */

//promocode.js controller
const PromoCode = require('../models/PromoCode');
const Tourist = require('../models/Tourist');

// Create Promo Code and assign it to all tourists
exports.createPromoCode = async (req, res) => {
	try {
		const { code, discount, expirationDate } = req.body;

		if (!code || !discount || !expirationDate) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		const existingPromoCode = await PromoCode.findOne({ code });
		if (existingPromoCode) {
			return res.status(400).json({ message: 'Promo code already exists' });
		}

		// Create a new promo code
		const newPromoCode = new PromoCode({
			code,
			discount,
			expirationDate,
		});

		await newPromoCode.save();

		// Find all tourists and add the promo code to their promoCodes array
		const tourists = await Tourist.find();

		// Update all tourists to include the new promo code
		for (let tourist of tourists) {
			tourist.promoCodes.push(newPromoCode._id);
			await tourist.save();
		}

		return res.status(201).json({
			message: 'Promo code created and added to all tourists',
			promoCode: newPromoCode,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Server error', error: error.message });
	}
};

// Get All Promo Codes
exports.getPromoCodes = async (req, res) => {
	try {
		const promoCodes = await PromoCode.find();
		return res.status(200).json(promoCodes);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching promo codes', error: error.message });
	}
};

// Delete Promo Code
exports.deletePromoCode = async (req, res) => {
	try {
		const { id } = req.params;

		const promoCode = await PromoCode.findByIdAndDelete(id);
		if (!promoCode) {
			return res.status(404).json({ message: 'Promo code not found' });
		}

		return res.status(200).json({ message: 'Promo code deleted successfully' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error deleting promo code', error: error.message });
	}
};
