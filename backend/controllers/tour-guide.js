/** @format */
const User = require('../models/User');
exports.createTourGuideProfile = async (req, res) => {
	const { mobileNumber, yearsOfExperience, previousWork } = req.body;

	try {
		const user = await User.findById(req.user._id);
		console.log('User found:', user); // Log the user object

		if (user.role !== 'tour_guide') {
			return res
				.status(403)
				.json({ message: 'Access denied. Not a tour guide.' });
		}

		user.tourGuideProfile = {
			mobileNumber,
			yearsOfExperience,
			previousWork: previousWork || null, // Optional field
		};

		await user.save();
		res.status(200).json({
			message: 'Profile updated successfully',
			tourGuideProfile: user.tourGuideProfile,
		});
	} catch (error) {
		console.error('Error updating profile:', error); // Log the error
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getTourGuideProfile = async (req, res) => {
	const userId = req.user._id;

	try {
		const user = await User.findById(userId);
		console.log('User found for profile:', user); // Log the user object

		if (!user || user.role !== 'tour_guide') {
			return res
				.status(403)
				.json({ message: 'Access denied. Not a tour guide.' });
		}

		res.json({ tourGuideProfile: user.tourGuideProfile });
	} catch (error) {
		console.error('Error retrieving profile:', error); // Log the error
		res.status(500).json({ message: 'Server error' });
	}
};
