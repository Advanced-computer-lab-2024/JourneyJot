/** @format */

// controllers/activityController.js

const Activity = require('../models/Activity');
const Category = require('../models/Category');

// Create a new activity
exports.createActivity = async (req, res) => {
	try {
		const formattedDate = new Date(req.body.date).toISOString().split('T')[0];
		const activity = new Activity({
			advertiserId: req.user._id,
			...req.body, // Spread the body data into the new itinerary
		});
		await activity.save();
		return res
			.status(201)
			.json({ message: 'Activity created successfully', activity });
	} catch (error) {
		console.log(req.user);
		console.log(error);
		return res.status(500).json({ message: 'Error creating activity', error });
	}
};

// Get all activities
exports.getActivities = async (req, res) => {
	try {
		const { category } = req.query;
		// Modify the query to include the flagged condition
		const query = {
			...(category ? { category } : {}),
			flagged: false, // Only include activities that are not flagged
		};

		const activities = await Activity.find(query)
			.populate('category tags')
			.populate({
				path: 'advertiserId',
				match: { status: 'active' }, // Only include activities for active advertisers
			})
			.exec();

		// Filter out any activities where the populated advertiserId is null (i.e., advertiser is not active)
		const activeActivities = activities.filter(
			(activity) => activity.advertiserId
		);

		console.log(activeActivities); // Debugging log to check active activities
		res.status(200).json({ activities: activeActivities });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.getActivity = async (req, res) => {
	const { id } = req.params;
	try {
		const activity = await Activity.findById(id).populate(
			'advertiserId category tags'
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
		console.log(req.query);

		// Add filters based on query parameters
		if (req.query.price) {
			query.price = { $lte: req.query.price }; // Less than or equal to budget
		}

		if (req.query.date) {
			query.date = { $gte: new Date(req.query.date) }; // On or after the specified date
		}

		if (req.query.category) {
			// Step 1: Find the category by name to get its ID
			const category = await Category.findOne({ name: req.query.category });
			if (!category) {
				return res.status(404).json({ message: 'Category not found' });
			}
			// Step 2: Use the category ID in the activity query
			query.category = category._id;
		}
		if (req.query.ratings) {
			query.ratings = { $gte: req.query.ratings }; // Greater than or equal to specified rating
		}

		// Fetch filtered activities
		const activities = await Activity.find(query).populate('category tags');
		console.log(activities); // Debugging log to check fetched activities

		// Return the result
		return res.status(200).json({ count: activities.length, data: activities });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
};

exports.sortByPriceOrRating = async (req, res) => {
	try {
		const { type } = req.query;
		let sortCriteria = {};

		if (type === 'price') {
			sortCriteria.price = 1; // Sort by price in ascending order
		} else if (type === 'rating') {
			sortCriteria.ratings = -1; // Sort by ratings in descending order
		} else {
			return res.status(400).json({ message: 'Invalid sort type' });
		}

		const activities = await Activity.find()
			.sort(sortCriteria)
			.populate('category, tags');
		return res.status(200).json({ count: activities.length, data: activities });
	} catch (error) {
		return res.status(500).json({ message: 'Error sorting activities', error });
	}
};
