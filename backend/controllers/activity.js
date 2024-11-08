/** @format */

// controllers/activityController.js

const Activity = require('../models/Activity');
const Category = require('../models/Category');
const PreferenceTag = require('../models/preferenceTag');
// Create a new activity
exports.createActivity = async (req, res) => {
	try {
		const formattedDate = new Date(req.body.date).toISOString().split('T')[0];
		const activity = new Activity({
			advertiserId: req.user._id,
			...req.body, // Spread the body data into the new activity
		});
		await activity.save();
		return res
			.status(201)
			.json({ message: 'Activity created successfully', activity });
	} catch (error) {
		console.log(error); // Better logging of the error, not req.user
		return res.status(500).json({ message: 'Error creating activity', error });
	}
};

// Get all activities
// Get all activities
exports.getActivities = async (req, res) => {
	try {
		const { category, preferenceTag } = req.query;

		// Prepare the query object
		const query = {
			...(category ? { category } : {}),
			...(preferenceTag ? { preferenceTag } : {}),
			flagged: false, // Only include activities that are not flagged
		};

		// Fetch activities with population
		const activities = await Activity.find(query)
			.populate('category preferenceTag') // Populate category and preferenceTag
			.populate({
				path: 'advertiserId',
				match: { status: 'active' }, // Only include activities for active advertisers
			})
			.exec();

		// Filter out activities where advertiserId is null (i.e., advertiser is not active)
		const activeActivities = activities.filter(
			(activity) => activity.advertiserId
		);

		// Log the active activities for debugging
		console.log(activeActivities);

		// Return the active activities
		res.status(200).json({ activities: activeActivities });
	} catch (error) {
		// Log the error message for debugging
		console.error('Error fetching activities:', error.message);
		res.status(400).json({ error: error.message });
	}
};

exports.getActivity = async (req, res) => {
	const { id } = req.params;
	try {
		const activity = await Activity.findById(id).populate(
			'advertiserId category preferenceTag' // Populate both category and preferenceTag
		);
		return res.status(200).json(activity);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching activities', error });
	}
};

// Update an activity
exports.updateActivity = async (req, res) => {
	const { id } = req.params;
	try {
		const activity = await Activity.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (!activity) {
			return res.status(404).json({ message: 'Activity not found' });
		}
		return res
			.status(200)
			.json({ message: 'Activity updated successfully', activity });
	} catch (error) {
		return res.status(500).json({ message: 'Error updating activity', error });
	}
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
	const { id } = req.params;
	try {
		const activity = await Activity.findByIdAndDelete(id);
		if (!activity) {
			return res.status(404).json({ message: 'Activity not found' });
		}
		return res.status(200).json({ message: 'Activity deleted successfully' });
	} catch (error) {
		return res.status(500).json({ message: 'Error deleting activity', error });
	}
};

exports.getFilteredActivities = async (req, res) => {
	try {
		const query = {};
		console.log('Query parameters:', req.query); // Log the query parameters

		// Add filters based on query parameters
		if (req.query.price) {
			query.price = { $lte: parseFloat(req.query.price) }; // Ensure price is a number and filter less than or equal
			console.log('Price filter:', query.price);
		}

		if (req.query.date) {
			query.date = { $gte: new Date(req.query.date) }; // Filter by date on or after the specified date
			console.log('Date filter:', query.date);
		}

		if (req.query.category) {
			// Step 1: Find the category by name to get its ID
			const category = await Category.findOne({ name: req.query.category });
			if (!category) {
				return res.status(404).json({ message: 'Category not found' });
			}
			// Step 2: Use the category ID in the activity query
			query.category = category._id;
			console.log('Category filter:', query.category);
		}

		if (req.query.preferenceTag) {
			// Step 1: Find the preferenceTag by name to get its ID
			const preferenceTag = await PreferenceTag.findOne({
				name: req.query.preferenceTag,
			});

			if (!preferenceTag) {
				return res.status(404).json({ message: 'PreferenceTag not found' });
			}

			// Step 2: Use the preferenceTag ID in the activity query
			query.preferenceTag = preferenceTag._id;
			console.log('PreferenceTag filter:', query.preferenceTag);
		}

		if (req.query.rating) {
			let rating = parseFloat(req.query.rating); // Convert rating to float to ensure it's a valid number
			console.log('Requested Rating:', rating); // Log the requested rating for debugging

			if (isNaN(rating)) {
				return res.status(400).json({ message: 'Invalid rating value' }); // Handle invalid rating input
			}

			query.rating = { $gte: rating }; // Filter by rating greater than or equal to specified rating
			console.log('Rating filter:', query.rating); // Log the rating filter
		}

		// Fetch filtered activities
		const activities = await Activity.find(query).populate(
			'advertiserId category preferenceTag'
		); // Populate both category and preferenceTag

		console.log('Filtered Activities:', activities); // Debugging log to check fetched activities

		// Return the result
		return res.status(200).json({ count: activities.length, data: activities });
	} catch (error) {
		console.log('Error:', error.message);
		res.status(500).send({ message: error.message });
	}
};

exports.sortByPriceOrRating = async (req, res) => {
	try {
		const { type } = req.query;
		const sortCriteria =
			type === 'price'
				? { price: 1 } // Sort by price in ascending order
				: type === 'rating'
				? { rating: -1 } // Sort by rating in descending order
				: {}; // Default to no sorting

		if (!sortCriteria) {
			return res.status(400).json({ message: 'Invalid sort type' });
		}

		// Fetch and sort activities based on the criteria
		const activities = await Activity.find()
			.sort(sortCriteria)
			.populate('advertiserId category preferenceTag'); // Corrected .populate syntax

		return res.status(200).json({ count: activities.length, data: activities });
	} catch (error) {
		console.error('Error sorting activities:', error.message); // Improved error logging
		return res.status(500).json({ message: 'Error sorting activities', error });
	}
};
