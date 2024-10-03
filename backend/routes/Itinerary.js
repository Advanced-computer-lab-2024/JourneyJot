/** @format */

const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');

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
		const newItinerary = {
			title: req.body.title,
			activities: req.body.activities,
			locations: req.body.locations,
			timeline: req.body.timeline || 'Default timeline',
			duration: req.body.duration,
			language: req.body.language,
			price: req.body.price,
			availableDates: req.body.availableDates || [],
			accessibility: req.body.accessibility || false,
			pickupLocation: req.body.pickupLocation,
			dropOffLocation: req.body.dropOffLocation,
		};

		// Create and save the new tour guide
		const itinerary = await Itinerary.create(newItinerary);
		return res.status(201).send(itinerary); // Status 201 for successful creation
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ error: error.message });
	}
});

// GET all Tour Guide itineraries
router.get('/', async (req, res) => {
	try {
		const itinerary = await Itinerary.find({}); // Fetch all itineraries
		return res.status(200).json({ count: itinerary.length, data: itinerary });
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: error.message });
	}
});
router.get('/:id', async (req, res) => {
	try {
		const itinerary = await Itinerary.findById(req.params.id);
		if (!itinerary) {
			return res.status(404).json({ message: 'Itinerary not found' });
		}
		res.status(200).json(itinerary);
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
		const updatedItinerary = await Itinerary.findByIdAndUpdate(
			req.params.id,
			req.body
		);

		if (!updatedItinerary) {
			return res.status(400).send({ message: 'updatedItinerary not updated' });
		}
		return res.status(200).send({ message: 'updatedItinerary updated' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
		if (!deletedItinerary) {
			return res.status(400).send({ message: 'Itinerary not deleted' });
		}
		return res.status(200).send({ message: 'Itinerary deleted' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
