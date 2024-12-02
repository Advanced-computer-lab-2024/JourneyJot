/** @format */

const Product = require('../models/Product'); // Product Model
const Notification = require('../models/Notification'); // Notification Model
const { sendOutOfStockEmail } = require('../services/emailService'); // Email sending service

exports.updateStock = async (req, res) => {
	const { productName, newQuantity } = req.body; // Use productName instead of productId

	try {
		// Find the product by its name in the database
		const product = await Product.findOne({ name: productName }); // Find by product name

		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		// Store the old quantity before update
		const oldQuantity = product.quantity;
		product.quantity = newQuantity;

		// If the stock reaches 0 and notification hasn't been sent
		if (newQuantity === 0 && !product.isNotified) {
			const message = `The product "${product.name}" is out of stock.`;

			// Create a system notification for the Admin/Seller
			await Notification.create({
				userId: req.user._id, // Admin or Seller ID (from authenticated user)
				message,
			});

			// Mark the product as notified to avoid sending multiple notifications
			product.isNotified = true;

			// Optionally, send an email notification for out-of-stock
			await sendOutOfStockEmail(product.name, req.user.email);
		}

		// If the stock is updated to a value greater than 0 and a notification has been sent, delete the notification
		if (newQuantity > 0 && oldQuantity === 0 && product.isNotified) {
			// Find and delete the out-of-stock notification
			await Notification.deleteOne({
				userId: req.user._id,
				message: { $regex: /out of stock/i }, // Filter notification containing 'out of stock'
			});

			// Reset the notified flag to allow future notifications if quantity reaches 0 again
			product.isNotified = false;
		}

		// Save the product back to the database
		await product.save();

		res.status(200).json({ message: 'Product stock updated successfully' });
	} catch (error) {
		console.error('Error updating stock:', error);
		res.status(500).json({ error: 'Failed to update stock' });
	}
};

exports.getNotifications = async (req, res) => {
	try {
		// Step 1: Check all products to see if any has quantity 0 and create notifications
		const products = await Product.find(); // Fetch all products
		for (let product of products) {
			if (product.quantity === 0 && !product.isNotified) {
				// Create a notification if the product's quantity is 0 and it hasn't been notified yet
				const existingNotification = await Notification.findOne({
					userId: req.user._id,
					productId: product._id,
					message: { $regex: /out of stock/i },
				});

				if (!existingNotification) {
					// Create a new notification only if one doesn't exist already
					await Notification.create({
						userId: req.user._id,
						productId: product._id,
						message: `The product "${product.name}" is out of stock.`,
					});

					// Mark the product as notified
					product.isNotified = true;
					await product.save();
				}
			}
		}

		// Step 2: Fetch notifications for the logged-in Admin/Seller related to out-of-stock products
		const notifications = await Notification.find({
			userId: req.user._id,
			message: { $regex: /out of stock/i }, // Filter notifications containing 'out of stock'
		})
			.sort({ createdAt: -1 }) // Sort by most recent
			.select('-__v'); // Exclude unwanted fields

		res.status(200).json({ notifications });
	} catch (error) {
		console.error('Error fetching notifications:', error);
		res.status(500).json({ error: 'Failed to fetch notifications' });
	}
};
