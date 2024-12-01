/** @format */

const User = require('../models/User');
const Tourist = require('../models/Tourist');
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
		// Check for Seller without restrictions for deletion
		if (req.user.role === 'seller') {
			// Sellers can request deletion without checking activities or itineraries
			await User.findByIdAndUpdate(userId, { status: 'pending_deletion' });
			return res.status(200).json({
				message:
					'Account marked for deletion. Your Seller profile will be hidden from public view.',
			});
		}

		// Check for upcoming activities or itineraries based on user role
		if (req.user.role === 'advertiser') {
			upcomingActivities = await Activity.find({
				advertiserId: userId, // Filters by the advertiser's ID
				date: { $gte: new Date() }, // Fetch only future activities
			});
			console.log('Upcoming Activities:', upcomingActivities.length);

			// If there are any upcoming activities, deny the deletion
			if (upcomingActivities.length > 0) {
				return res.status(400).json({
					message: 'Cannot delete account. You have upcoming activities.',
				});
			}
		} else if (req.user.role === 'tour_guide') {
			// For tour guides, check upcoming itineraries
			upcomingItineraries = await Itinerary.find({
				tourGuideId: userId, // Filters by the tour guide's ID
				availableDates: { $elemMatch: { $gte: new Date() } },
			});
			console.log('Upcoming Itineraries:', upcomingItineraries.length);

			// If there are any upcoming itineraries, deny the deletion
			if (upcomingItineraries.length > 0) {
				return res.status(400).json({
					message: 'Cannot delete account. You have upcoming itineraries.',
				});
			}
		}

		// Mark account for deletion for other roles if no issues
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
