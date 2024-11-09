/** @format */

// controllers/productController.js

const Product = require('../models/Product');
const mongoose = require('mongoose');

const uploadProductImage = async (req, res) => {
	try {
		// Ensure that productId is present and valid
		const { productId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return res.status(400).json({ message: 'Invalid Product ID' });
		}

		// Find the product by ID
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Check if the file is uploaded
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}

		// Check file type (optional: ensure only images are allowed)
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!allowedTypes.includes(req.file.mimetype)) {
			return res
				.status(400)
				.json({ message: 'Invalid file type. Only images are allowed.' });
		}

		// Set the product picture to the uploaded file's filename
		product.picture = req.file.filename;

		// Save the updated product
		await product.save();

		// Respond with success and the image filename
		return res.status(200).json({
			message: 'Image uploaded successfully',
			filename: req.file.filename,
		});
	} catch (err) {
		console.error('Error uploading product image:', err);
		return res
			.status(500)
			.json({ message: 'Error uploading image', error: err.message });
	}
};

module.exports = { uploadProductImage };
