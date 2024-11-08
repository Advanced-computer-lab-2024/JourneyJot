/** @format */

const Activity = require('../models/Activity');
const Itinerary = require('../models/Itinerary');

exports.flagItinerary = async (req, res) => {
	const { id } = req.params;
	try {
		const itinerary = await Itinerary.findByIdAndUpdate(
			id,
			{ flagged: true },
			{ new: true }
		);
		if (!itinerary) {
			return res.status(404).json({ message: 'Itinerary not found' });
		}
		res
			.status(200)
			.json({ message: 'Itinerary flagged successfully', itinerary });
	} catch (error) {
		res.status(500).json({ message: 'Error flagging itinerary', error });
	}
};

exports.flagActivity = async (req, res) => {
	const { id } = req.params;
	try {
		const activity = await Activity.findByIdAndUpdate(
			id,
			{ flagged: true },
			{ new: true }
		);
		if (!activity) {
			return res.status(404).json({ message: 'Activity not found' });
		}
		res
			.status(200)
			.json({ message: 'Activity flagged successfully', activity });
	} catch (error) {
		res.status(500).json({ message: 'Error flagging activity', error });
	}
};
