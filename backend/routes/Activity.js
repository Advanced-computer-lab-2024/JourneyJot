//** @format */

const express = require('express');
const Activity = require('../models/Activity');
const router = express.Router();

// Create a new activity
router.post('/', async (req, res) => {
	try {
		// Check if all required fields are present in the request body
		if (
			!req.body.title ||
			!req.body.date ||
			!req.body.time ||
			!req.body.location ||
			!req.body.price ||
			!req.body.category ||
			!req.body.tags ||
			!req.body.specialDiscounts ||
			!req.body.bookingOpen
		) {
			return res.status(400).send({ message: 'Send All Required Fields' });
		}

		// Create a new activity object
		const newActivity = {
			title: req.body.title,
			date: req.body.date,
			time: req.body.time,
			location: req.body.location,
			price: req.body.price,
			category: req.body.category,
			tags: req.body.tags,
			specialDiscounts: req.body.specialDiscounts,
			bookingOpen: req.body.bookingOpen,
		};

		// Save the activity to the database
		const activity = await Activity.create(newActivity);
		return res.status(200).send(activity);
	} catch (error) {
		console.log(error.message);
		res.status(400).json({ error: error.message });
	}
});

// Get all activities with optional filters and sorting
router.get('/', async (req, res) => {
	try {
		// Prepare a query object
		const query = {};

		// Check for query parameters and add filters accordingly
		if (req.query.budget) {
			query.price = { $lte: req.query.budget }; // Finds activities less than or equal to the budget
		}

		if (req.query.date) {
			query.date = { $gte: new Date(req.query.date) }; // Finds activities on or after the specified date
		}

		if (req.query.category) {
			query.category = req.query.category; // Matches the exact category
		}

		if (req.query.ratings) {
			query.ratings = { $gte: req.query.ratings }; // Finds activities with ratings greater than or equal to the specified rating
		}

		// Fetch activities based on the constructed query
		let activities = await Activity.find(query);

		// Sorting based on query parameters (price or ratings)
		if (req.query.sortBy) {
			const sortCriteria = {};
			if (req.query.sortBy === 'price') {
				sortCriteria.price = req.query.order === 'desc' ? -1 : 1; // Sort by price ascending or descending
			} else if (req.query.sortBy === 'ratings') {
				sortCriteria.ratings = req.query.order === 'desc' ? -1 : 1; // Sort by ratings ascending or descending
			}
			activities = await Activity.find(query).sort(sortCriteria); // Apply sorting
		}

		// Return the result
		return res.status(200).json({ count: activities.length, data: activities });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

// Get a specific activity by ID
router.get('/:id', async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id);
		if (!activity) {
			return res.status(404).json({ message: 'Activity not found' });
		}
		res.status(200).json(activity);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Update an activity by ID
router.put('/:id', async (req, res) => {
	try {
		// Check if all required fields are present
		if (
			!req.body.title ||
			!req.body.date ||
			!req.body.time ||
			!req.body.location ||
			!req.body.price ||
			!req.body.category ||
			!req.body.tags ||
			!req.body.specialDiscounts ||
			!req.body.bookingOpen
		) {
			return res.status(400).send({ message: 'Send All Required Fields' });
		}

		// Update the activity
		const updatedActivity = await Activity.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true } // Return the updated document
		);
		if (!updatedActivity) {
			return res.status(400).send({ message: 'Activity not Updated' });
		}

		// Return success message
		return res.status(200).send({ message: 'Activity Updated', updatedActivity });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

// Delete an activity by ID
router.delete('/:id', async (req, res) => {
	try {
		// Find and delete the activity
		const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
		if (!deletedActivity) {
			return res.status(400).send({ message: 'Activity not Deleted' });
		}

		// Return success message
		return res.status(200).send({ message: 'Activity Deleted' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
