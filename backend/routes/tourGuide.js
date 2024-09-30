/** @format */

const express = require('express');
const router = express.Router();
const TourGuide = require('../models/TourGuide.js');

// CREATE a new Tour Guide itinerary
router.post('/', async (req, res) => {
	try {
		// Check for missing required fields
		const requiredFields = [
			'title',
			'activities',
			'locations',
			'duration',
			'language',
			'price',
			'pickupLocation',
			'dropOffLocation',
		];

		// Ensure all required fields are present
		for (let field of requiredFields) {
			if (!req.body[field]) {
				return res.status(400).send({ message: `${field} is required` });
			}
		}

		// Construct new itinerary data
		const newTourGuide = {
			title: req.body.title,
			activities: req.body.activities,
			locations: req.body.locations,
			timeline: req.body.timeline || 'Default timeline', // Optional field with a default
			duration: req.body.duration,
			language: req.body.language,
			price: req.body.price,
			availableDates: req.body.availableDates || [], // Optional or empty array by default
			accessibility: req.body.accessibility || false, // Optional with default false
			pickupLocation: req.body.pickupLocation,
			dropOffLocation: req.body.dropOffLocation,
		};

		// Create and save the new tour guide
		const tourGuide = await TourGuide.create(newTourGuide);
		return res.status(201).send(tourGuide); // Status 201 for successful creation
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ error: error.message });
	}
});

// GET all Tour Guide itineraries
router.get('/', async (req, res) => {
	try {
		const tourGuides = await TourGuide.find({}); // Fetch all itineraries
		return res.status(200).json({ count: tourGuides.length, data: tourGuides });
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: error.message });
	}
});
router.get('/:id', async (req, res) => {
	try {
		const tourGuide = await TourGuide.findById(req.params.id);
		if (!tourGuide) {
			return res.status(404).json({ message: 'TourGuide not found' });
		}
		res.status(200).json(tourGuide);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.put('/:id', async (req, res) => {
	try {
		const requiredFields = [
			'title',
			'activities',
			'locations',
			'duration',
			'language',
			'price',
			'pickupLocation',
			'dropOffLocation',
		];

		// Ensure all required fields are present
		for (let field of requiredFields) {
			if (!req.body[field]) {
				return res.status(400).send({ message: `${field} is required` });
			}
		}
		const updatedTourGuide = await TourGuide.findByIdAndUpdate(
			req.params.id,
			req.body
		);

		if (!updatedTourGuide) {
			return res.status(400).send({ message: 'updatedTourGuide not found' });
		}
		return res.status(200).send({ message: 'updatedTourGuide found' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const deletedTourGuide = await TourGuide.findByIdAndDelete(req.params.id);
		if (!deletedTourGuide) {
			return res.status(400).send({ message: 'TourGuide not found' });
		}
		return res.status(200).send({ message: 'TourGuide found' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
