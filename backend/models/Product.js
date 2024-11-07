/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
	{
		picture: {
			type: String,
			required: false,
		},
		name: {
			type: String,
			required: false,
		},

		details: {
			type: String,
			required: false,
		},
		price: {
			type: Number,
			required: false,
		},
		quantity: {
			type: Number,
			required: false,
		},
		rating: {
			type: Number,
			required: false,
			default: 0,
		},
		reviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Review', // Reference to the Review model
			},
		],
		archived: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

// Method to calculate average rating
productSchema.methods.calculateAverageRating = async function () {
	// Use MongoDB aggregation to calculate the average rating
	const result = await mongoose.model('Review').aggregate([
		{ $match: { product: this._id } }, // Match reviews for the specific product
		{ $group: { _id: null, avgRating: { $avg: '$rating' } } }, // Calculate the average rating
	]);

	const averageRating = result.length > 0 ? result[0].avgRating : 0;
	this.rating = averageRating; // Set the average rating
	await this.save(); // Save the product with the updated rating
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
