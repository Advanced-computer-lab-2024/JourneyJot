/** @format */

const User = require('../models/User');
const Activity = require('../models/Activity');
const Itinerary = require('../models/Itinerary');

exports.deleteRequest = async (req, res) => {
	const userId = req.user._id;
	let upcomingActivities = [];
	let upcomingItineraries = [];

	console.log('User ID:', userId);
	console.log('Current Date:', new Date());
	console.log('User:', req.user);
	console.log('User Role:', req.user ? req.user.role : 'No role defined');

	try {
		// Check for upcoming activities or itineraries based on user role
		if (req.user.role === 'advertiser') {
			upcomingActivities = await Activity.find({
				advertiserId: userId, // Ensures it filters by the advertiser's ID
				date: { $gte: new Date() }, // Fetch only future activities
			});
			console.log('Upcoming Activities:', upcomingActivities.length);
		} else if (req.user.role === 'tour_guide') {
			// Ensure the role value matches what you expect
			upcomingItineraries = await Itinerary.find({
				tourGuideId: userId, // Ensure it filters by the tour guide's ID
				availableDates: { $elemMatch: { $gte: new Date() } },
			});
			console.log('Upcoming Itineraries:', upcomingItineraries.length);
		}

		// Check if there are any upcoming activities or itineraries
		if (upcomingActivities.length > 0 || upcomingItineraries.length > 0) {
			return res.status(400).json({
				message: 'Cannot delete account with upcoming events or activities.',
			});
		}

		// Mark account for deletion
		await User.findByIdAndUpdate(userId, { status: 'pending_deletion' });

		res.status(200).json({
			message: 'Account marked for deletion. Your profile will be hidden.',
		});
	} catch (error) {
		console.error('Error:', error.message); // Log the error for debugging
		res.status(500).json({
			message: 'Error deleting account.',
			error: error.message,
		});
	}
};
