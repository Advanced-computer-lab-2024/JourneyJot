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
		// Create a new product from the request body
		const product = new Product({
			name: req.body.name,
			picture: req.body.picture, // Assuming the image is handled elsewhere
			details: req.body.details,
			price: req.body.price,
			quantity: req.body.quantity,
			rating: req.body.rating,
		});

		// Save the product to the database
		await product.save();

		// Return only the product ID after saving
		res.status(201).json({
			message: 'Product created successfully',
			_id: product._id, // Send back the product's _id
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.getProducts = async (req, res) => {
	try {
		const user = req.user; // Assuming req.user is populated by authentication middleware

		// Check if the user has an admin role
		let products;
		if ((user && user.role === 'admin') || user.role === 'seller') {
			// If the user is an admin, fetch all products (archived and non-archived)
			products = await Product.find();
		} else if (!user) {
			// If the user is not an admin, fetch only non-archived products
			products = await Product.find({ archived: false });
		}

		res.status(200).json({ products });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.getTouristProducts = async (req, res) => {
	try {
		// If the user is not an admin, fetch only non-archived products
		products = await Product.find({ archived: false });

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
exports.calculateProductsRevenue = async (req, res) => {
	try {
		// Fetch all activities
		const products = await Product.find();

		if (products.length === 0) {
			return res.status(404).json({ message: 'No Product found' });
		}

		const productsWithRevenue = products.map((product) => {
			return {
				id: product._id,
				name: product.title, // Assuming you have a 'name' field
				price: product.price,
				isBooked: product.isBooked,
				revenue: product.isBooked ? product.price : 0, // Revenue is price only if booked
			};
		});

		// Calculate the total revenue for all booked activities
		const totalRevenue = productsWithRevenue.reduce(
			(sum, product) => sum + product.revenue,
			0
		);

		return res.status(200).json({
			message: 'Itineraries and revenue calculated successfully',
			totalRevenue: totalRevenue.toFixed(2),
			products: productsWithRevenue,
		});
	} catch (error) {
		console.error('Error calculating Product revenue:', error);
		return res.status(500).json({
			message: 'An error occurred while calculating product revenue',
			error: error.message,
		});
	}
};
