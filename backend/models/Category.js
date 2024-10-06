/** @format */

// models/Category.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true, // Ensure category names are unique
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
