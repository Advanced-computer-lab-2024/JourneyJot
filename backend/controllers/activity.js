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
exports.getAllActivities = async (req, res) => {
	try {
		const { category, preferenceTag } = req.query;

		// Prepare the query object
		const query = {
			...(category ? { category } : {}),
			...(preferenceTag ? { preferenceTag } : {}),
		};

		// Fetch activities with population
		const activities = await Activity.find(query)
			.populate('category preferenceTag') // Populate category and preferenceTag
			.populate({
				path: 'advertiserId',
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
		const activity = await Activity.findById(id)
			.populate('advertiserId category preferenceTag') // Populate category and preferenceTag
			.populate({
				path: 'ratings.userId', // Populate the user details of the ratings
				select: 'username email', // Specify the fields you want to include from the Tourist model
			});

		if (!activity) {
			return res.status(404).json({ message: 'Activity not found' });
		}

		return res.status(200).json(activity);
	} catch (error) {
		return res.status(500).json({ message: 'Error fetching activity', error });
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
		const query = { flagged: false };
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
		let sortCriteria;

		// Set sort criteria based on type
		if (type === 'price') {
			sortCriteria = { price: 1 }; // Ascending by price
		} else if (type === 'rating') {
			sortCriteria = { rating: -1 }; // Descending by rating
		} else {
			return res.status(400).json({ message: 'Invalid sort type' });
		}

		// Fetch and sort activities with flagged: false filter
		const activities = await Activity.find({ flagged: false })
			.sort(sortCriteria)
			.populate('advertiserId category preferenceTag'); // Ensure correct population syntax

		return res.status(200).json({ count: activities.length, data: activities });
	} catch (error) {
		console.error('Error sorting activities:', error.message); // Improved error logging
		return res.status(500).json({ message: 'Error sorting activities', error });
	}
};

exports.getCompletedActivities = async (req, res) => {
	try {
		const { category, preferenceTag } = req.query;

		const query = {
			date: { $lt: new Date() }, // Filter for completed activities
		};

		if (category) {
			query.category = category; // category should be an ObjectId or string (depends on your model)
		}

		if (preferenceTag) {
			query.preferenceTag = preferenceTag; // preferenceTag should be an ObjectId or string (depends on your model)
		}

		const activities = await Activity.find(query)
			.populate('category preferenceTag') // Populate category and preferenceTag if they are ObjectIds
			.populate({
				path: 'advertiserId',
				match: { status: 'active' }, // Only include active advertisers
			})
			.populate({
				path: 'ratings.userId',
				select: 'email username',
			})
			.exec();

		const activeActivities = activities.filter(
			(activity) => activity.advertiserId
		);

		console.log('Active Activities:', activeActivities);

		res.status(200).json({ activities: activeActivities });
	} catch (error) {
		console.error('Error fetching activities:', error.message);
		res.status(400).json({ error: error.message });
	}
};
// Add Rating and Comment
exports.addRatingAndComment = async (req, res) => {
	try {
		const { rating, comment } = req.body;
		const activityId = req.params.id;
		const userId = req.user._id; // Assuming user is authenticated and `req.user` is populated

		// Find the activity and populate `userId` within `ratings`
		const activity = await Activity.findById(activityId);

		if (!activity) {
			return res.status(404).json({ message: 'Activity not found.' });
		}

		// Add the new rating to the ratings array
		activity.ratings.push({ userId, rating, comment });
		await activity.save();

		// Populate `userId` field after saving (populate can be done here on-the-fly)
		await activity.populate({
			path: 'ratings.userId',
			select: 'email username',
		});

		res.status(200).json({
			message: 'Rating and comment added successfully!',
			activity,
		});
	} catch (error) {
		console.error('Error adding rating and comment:', error.message);
		res.status(400).json({ error: error.message });
	}
};
exports.calculateActivityRevenue = async (req, res) => {
	try {
		// Fetch all activities
		const query = { flagged: false };
		if (req.query.date) {
			query.date = { $gte: new Date(req.query.date) }; // Filter by date on or after the specified date
			console.log('Date filter:', query.date);
		}

		const activities = await Activity.find(query).populate(
			'category advertiserId'
		);

		if (activities.length === 0) {
			return res.status(404).json({ message: 'No activities found' });
		}

		// Map through activities to include revenue only for booked ones
		const activitiesWithRevenue = activities.map((activity) => {
			return {
				id: activity._id,
				name: activity.advertiserId, // Assuming you have a 'name' field
				price: activity.price,
				date: activity.date,
				isBooked: activity.isBooked,
				revenue: activity.isBooked ? activity.price : 0, // Revenue is price only if booked
			};
		});

		// Calculate the total revenue for all booked activities
		const totalRevenue = activitiesWithRevenue.reduce(
			(sum, activity) => sum + activity.revenue,
			0
		);

		return res.status(200).json({
			message: 'Activities and revenue calculated successfully',
			totalRevenue: totalRevenue.toFixed(2),
			activities: activitiesWithRevenue,
		});
	} catch (error) {
		console.error('Error calculating activity revenue:', error);
		return res.status(500).json({
			message: 'An error occurred while calculating activity revenue',
			error: error.message,
		});
	}
};
