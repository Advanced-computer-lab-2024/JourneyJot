/** @format */

const mongoose = require('mongoose');

const userPaymentSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to your User model
	paymentMethodId: { type: String, required: true }, // Store the paymentMethodId from Stripe
	cardLast4: { type: String, required: true }, // Optionally store the last 4 digits of the card for display
	cardBrand: { type: String, required: true }, // Optionally store the brand (e.g., visa, mastercard)
	createdAt: { type: Date, default: Date.now }, // Track when the payment method was added
});

const UserPayment = mongoose.model('UserPayment', userPaymentSchema);
module.exports = UserPayment;
