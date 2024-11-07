// tourist-itinerary.js

const Itinerary = require("../models/TouristItinerary");
const Tourist = require("../models/Tourist");

// Helper function to calculate points and update tourist level
function calculatePointsAndLevel(tourist, paymentAmount) {
	// Define point calculation rates based on levels
	const levelMultipliers = {
		1: 0.5,
		2: 1.0,
		3: 1.5,
	};

	// Calculate points based on current level
	const pointsEarned = paymentAmount * (levelMultipliers[tourist.level] || 0.5);
	tourist.totalPoints += pointsEarned;
	tourist.redeemablePoints += pointsEarned;

	// Determine the level based on total points
	if (tourist.totalPoints >= 500000) {
		tourist.level = 3;
	} else if (tourist.totalPoints >= 100000) {
		tourist.level = 2;
	} else {
		tourist.level = 1;
	}
}

exports.addItinerary = async (req, res) => {
	try {
		const { activities, locations, startDate, endDate, tags, paymentAmount, touristId } = req.body;

		// Find the tourist by ID
		const tourist = await Tourist.findById(touristId);
		if (!tourist) {
			return res.status(404).json({ message: "Tourist not found" });
		}

		// Calculate points and update level
		calculatePointsAndLevel(tourist, paymentAmount);
		await tourist.save();

		// Create a new itinerary entry
		const itinerary = new Itinerary({
			activities,
			locations,
			startDate,
			endDate,
			tags,
		});
		await itinerary.save();

		res.status(201).json({
			message: "Itinerary created successfully, points awarded",
			itinerary,
			pointsEarned: tourist.redeemablePoints,
			level: tourist.level,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to create itinerary" });
	}
};

exports.getItineraries = async (req, res) => {
	try {
		const itineraries = await Itinerary.find();
		res.status(200).json(itineraries);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch itineraries" });
	}
};

exports.updatedItinerary = async (req, res) => {
	try {
		const updatedItinerary = await Itinerary.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedItinerary) {
			return res.status(404).json({ message: "Itinerary not found" });
		}
		res.status(200).json(updatedItinerary);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to update itinerary" });
	}
};

exports.deleteItinerary = async (req, res) => {
	try {
		const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
		if (!itinerary) {
			return res.status(404).json({ message: "Itinerary not found" });
		}
		res.status(200).json({ message: "Itinerary deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to delete itinerary" });
	}
};
