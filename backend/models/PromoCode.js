/** @format */
const mongoose = require('mongoose');
const promoCodeSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		discount: {
			type: Number,
			required: true, // Discount value (percentage or flat amount)
			validate: {
				validator: function (value) {
					return value > 0; // Ensure discount is greater than 0
				},
				message: 'Discount must be a positive value',
			},
		},
		expirationDate: {
			type: Date,
			required: true, // Expiration date for the promo code
		},
		isActive: {
			type: Boolean,
			default: true, // Determines if the promo code is active
		},
	},
	{ timestamps: true }
);

// Export the PromoCode model
const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
module.exports = PromoCode;
