const Activity = require('../models/Activity');
const Itinerary = require('../models/Itinerary');
const Museum = require('../models/Museum');

// Get all upcoming activities, itineraries, and historical places/museums
exports.viewAll = async (req, res) => {
  try {
    const today = new Date();

    // Query for upcoming activities (starting from today onwards)
    const upcomingActivities = await Activity.find({ date: { $gte: today } });

    // Query for upcoming itineraries (itineraries starting from today)
    const upcomingItineraries = await Itinerary.find({ startDate: { $gte: today } });

    // Query for all museums/historical places
    const museums = await Museum.find({});

    res.status(200).json({
      upcomingActivities,
      upcomingItineraries,
      museums
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
