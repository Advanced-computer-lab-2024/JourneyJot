/** @format */

// controllers/itineraryController.js

const Itinerary = require('../models/Itinerary');

exports.createItinerary = async (req, res) => {
	try {
		const newItinerary = new Itinerary({
			tourGuideId: req.user._id,
			...req.body, // Spread the body data into the new itinerary
		});
		await newItinerary.save();
		res.status(201).json({
			message: 'Itinerary created successfully',
			itinerary: newItinerary,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error creating itinerary', error });
	}
};

exports.getItineraries = async (req, res) => {
	try {
		const itineraries = await Itinerary.find({ flagged: false }) // Exclude flagged itineraries
			.populate({
				path: 'tourGuideId',
				match: { status: 'active' }, // Only include itineraries for active tour guides
			})
			.exec();

		// Filter out any itineraries where the populated tourGuideId is null (i.e., not active)
		const activeItineraries = itineraries.filter(
			(itinerary) => itinerary.tourGuideId // Only include itineraries with active tour guides
		);

		res.status(200).json(activeItineraries);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching itineraries', error });
	}
};

exports.getItinerary = async (req, res) => {
	const { id } = req.params;
	try {
		const itineraries = await Itinerary.findById(id);
		res.status(200).json(itineraries);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching itineraries', error });
	}
};

exports.updateItinerary = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedItinerary = await Itinerary.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (!updatedItinerary)
			return res.status(404).json({ message: 'Itinerary not found' });
		res.status(200).json({
			message: 'Itinerary updated successfully',
			itinerary: updatedItinerary,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error updating itinerary', error });
	}
};

exports.deleteItinerary = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedItinerary = await Itinerary.findByIdAndDelete(id);
		if (!deletedItinerary)
			return res.status(404).json({ message: 'Itinerary not found' });
		res.status(200).json({ message: 'Itinerary deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting itinerary', error });
	}
};

exports.sortByPriceOrRating = async (req, res) => {
	try {
		const { type } = req.query;
		let sortCriteria = {};

		if (type === 'price') {
			sortCriteria.price = 1; // Sort by price in ascending order
		} else if (type === 'rating') {
			sortCriteria.rating = -1; // Sort by ratings in descending order
		} else {
			return res.status(400).json({ message: 'Invalid sort type' });
		}

		const itineraries = await Itinerary.find().sort(sortCriteria);
		return res
			.status(200)
			.json({ count: itineraries.length, data: itineraries });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error sorting itineraries', error });
	}
};

exports.filterItineraries = async (req, res) => {
	try {
		const { budget, date, preferences, language } = req.query;

		// Build the filter object
		let filter = {};

		if (budget) {
			filter.price = { $lte: Number(budget) }; // Filter for budget less than or equal to specified amount
		}

		if (date) {
			filter.date = { $gte: new Date(date) }; // Filter for itineraries on or after the specified date
		}

		if (preferences) {
			filter.preferences = { $in: preferences.split(',') }; // Filter for specific preferences
		}

		if (language) {
			filter.language = language; // Filter for specific language
		}

		const itineraries = await Itinerary.find(filter);
		res.json(itineraries);
	} catch (error) {
		res.status(500).send(error);
	}
};
