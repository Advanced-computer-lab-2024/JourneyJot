/** @format */
const Tourist = require('../models/Tourist');
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
			...user.tourGuideProfile, // Retain existing fields
			mobileNumber: mobileNumber || user.tourGuideProfile.mobileNumber,
			yearsOfExperience:
				yearsOfExperience || user.tourGuideProfile.yearsOfExperience,
			previousWork: previousWork || user.tourGuideProfile.previousWork, // Optional field
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

exports.getTourGuideProfile = async (req, res) => {
	try {
		const tourGuideId = req.params.id; // Assuming the tour guide ID is passed in the route parameters

		// Find the user with the embedded tourGuideProfile
		const tourGuide = await User.findById(tourGuideId);

		if (!tourGuide || !tourGuide.tourGuideProfile) {
			return res.status(404).json({ message: 'Tour Guide not found.' });
		}

		// Populate user details for each rating manually
		const populatedRatings = await Promise.all(
			tourGuide.tourGuideProfile.ratings.map(async (rating) => {
				const user = await Tourist.findById(rating.userId, 'email username'); // Fetch only email and username
				return {
					...rating.toObject(), // Convert Mongoose subdocument to plain object
					userId: user, // Replace userId with the populated user details
				};
			})
		);

		// Send response with the populated tour guide profile
		res.status(200).json({
			message: 'Tour Guide profile retrieved successfully!',
			tourGuideProfile: {
				...tourGuide.tourGuideProfile.toObject(),
				ratings: populatedRatings,
			},
		});
	} catch (error) {
		console.error('Error retrieving tour guide profile:', error.message);
		res.status(400).json({ error: error.message });
	}
};

exports.addRatingAndComment = async (req, res) => {
	try {
		const { rating, comment } = req.body;
		const tourGuideId = req.params.id; // Assuming the tour guide ID is passed in the route parameters
		const userId = req.user._id; // Assuming user is authenticated and `req.user` is populated

		// Find the user with the embedded tourGuideProfile
		const tourGuide = await User.findById(tourGuideId);

		if (!tourGuide || !tourGuide.tourGuideProfile) {
			return res.status(404).json({ message: 'Tour Guide not found.' });
		}

		// Add the new rating to the ratings array within `tourGuideProfile`
		tourGuide.tourGuideProfile.ratings.push({ userId, rating, comment });
		await tourGuide.save();

		// Populate user details for each rating manually
		const populatedRatings = await Promise.all(
			tourGuide.tourGuideProfile.ratings.map(async (rating) => {
				const user = await Tourist.findById(rating.userId, 'email username'); // Fetch only email and username
				return {
					...rating.toObject(), // Convert Mongoose subdocument to plain object
					userId: user, // Replace userId with the populated user details
				};
			})
		);

		// Send response with the populated tour guide profile
		res.status(200).json({
			message: 'Rating and comment added successfully!',
			tourGuideProfile: {
				...tourGuide.tourGuideProfile.toObject(),
				ratings: populatedRatings,
			}, // Send populated ratings
		});
	} catch (error) {
		console.error('Error adding rating and comment:', error.message);
		res.status(400).json({ error: error.message });
	}
};
