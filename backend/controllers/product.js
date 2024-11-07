/** @format */

const Product = require('../models/Product');

exports.getSorted = async (req, res) => {
	// <- Middleware applied correctly
	try {
		const products = await Product.find().sort({ rating: -1 });
		res.status(200).json({ products });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.searchByName = async (req, res) => {
	// <- Added middleware here as well
	const { productName } = req.query;
	try {
		const products = await Product.find({
			name: { $regex: productName, $options: 'i' },
		});
		res.status(200).json({ products });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.filterByPrice = async (req, res) => {
	const { minPrice, maxPrice } = req.query;
	try {
		const products = await Product.find({
			price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
		});
		if (products.length === 0) {
			return res
				.status(404)
				.json({ message: 'No products found in this price range' });
		}
		res.status(200).json({ products });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.addProduct = async (req, res) => {
	try {
		const product = new Product({
			name: req.body.name,
			picture: req.body.picture,
			details: req.body.details,
			price: req.body.price,
			quantity: req.body.quantity,
			rating: req.body.rating,
		});

		await product.save();
		res.status(201).json({
			message: 'Product created successfully',
			product,
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.getProducts = async (req, res) => {
	try {
		const products = await Product.find({ archived: false });
		res.status(200).json({ products });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// editing a product by id
exports.editProductByID = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.name = req.body.name || product.name;
			product.picture = req.body.picture || product.picture;
			product.details = req.body.details || product.details;
			product.price = req.body.price || product.price;
			product.quantity = req.body.quantity || product.quantity;
			product.rating = req.body.rating || product.rating;
			await product.save();
			res.status(200).json({
				message: 'Product updated successfully',
				product,
			});
		} else {
			res.status(404).json({ message: 'Product not found' });
		}
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.getProductByID = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate({
			path: 'reviews', // Populate the reviews array
			populate: {
				path: 'user', // Populate the user field inside each review
				select: 'username email', // Optionally, specify which fields of the user to select
			},
		});

		if (product) {
			res.status(200).json({ product });
		} else {
			res.status(404).json({ message: 'Product not found' });
		}
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
