/** @format */

// models/Tag.js

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			enum: ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'], // Allowed types
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Tag', tagSchema);
