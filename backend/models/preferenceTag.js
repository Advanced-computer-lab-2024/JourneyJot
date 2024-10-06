/** @format */

const mongoose = require('mongoose');

const preferenceTagSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		enum: [
			'historic areas',
			'beaches',
			'family-friendly',
			'shopping',
			'budget-friendly',
		], // Specify allowed tags
	},
});

module.exports = mongoose.model('PreferenceTag', preferenceTagSchema);
