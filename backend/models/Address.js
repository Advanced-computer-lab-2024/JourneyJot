/** @format */

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tourist',
			required: true,
		},
		address: { type: String, required: true },
		city: { type: String, required: true },
		state: { type: String, required: true },
		zip: { type: String, required: true },
		country: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
