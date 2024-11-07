/** @format */

const Product = require('../models/Product');

// Archive a product
exports.archiveProduct = async (req, res) => {
	try {
		const productId = req.params.id; // Get the product ID from the URL

		// Find the product by ID and update the archived status
		const product = await Product.findByIdAndUpdate(
			productId,
			{ archived: true },
			{ new: true }
		);

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.status(200).json({ message: 'Product archived successfully', product });
	} catch (error) {
		res.status(500).json({ message: 'Error archiving product', error });
	}
};
// Unarchive a product
exports.unarchiveProduct = async (req, res) => {
	try {
		const productId = req.params.id; // Get the product ID from the URL

		// Find the product by ID and update the archived status
		const product = await Product.findByIdAndUpdate(
			productId,
			{ archived: false },
			{ new: true }
		);

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res
			.status(200)
			.json({ message: 'Product unarchived successfully', product });
	} catch (error) {
		res.status(500).json({ message: 'Error unarchiving product', error });
	}
};
