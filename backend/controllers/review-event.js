/** @format */

const Review = require('../models/ReviewEvent');

// Controller to add a new review
exports.addReview = async (req, res) => {
	const { touristId, tourGuideId, rating, comment } = req.body;

	try {
		const newReview = new Review({
			touristId,
			tourGuideId,
			rating,
			comment,
		});

		await newReview.save();
		res
			.status(201)
			.json({ message: 'Review added successfully', review: newReview });
	} catch (error) {
		res.status(500).json({ error: 'Failed to add review' });
	}
};

// Controller to get all reviews for a specific tour guide
exports.getReviewsByTourGuide = async (req, res) => {
	const { tourGuideId } = req.params;

	try {
		const reviews = await Review.find({ tourGuideId }).populate(
			'touristId tourGuideId'
		);
		res.status(200).json(reviews);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch reviews' });
	}
};
