/** @format */

const Activity = require('../models/Activity');

exports.getMyActivities = async (req, res) => {
	try {
		// Ensure the user is an Advertiser
		if (req.user.userType !== 'advertiser') {
			return res.status(403).json({ message: 'Access denied' });
		}

		const activities = await Activity.find({ createdBy: req.user.id });
		res.status(200).json(activities);
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

// Add more functions if Advertisers can create other items
