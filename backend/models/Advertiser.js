/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const advertiserSchema = new Schema({
	title: { type: String, required: true },
	date: { type: Date, required: true },
	time: { type: String, required: true },
	location: {
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
	},
	price: { type: Number, required: true },
	category: { type: String, required: true },
	tags: [String],
	specialDiscounts: { type: String },
	bookingOpen: { type: Boolean, default: true },
});

const Advertiser = mongoose.model('Advertiser', advertiserSchema);

module.exports = Advertiser;
