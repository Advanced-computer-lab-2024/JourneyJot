// routes/ItineraryRoute.js
const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');

// Create a new itinerary
router.post('/', async (req, res) => {
    const { tourGuide, title, activities, dateRange, tags } = req.body;

    const newItinerary = new Itinerary({
        tourGuide,
        title,
        activities,
        dateRange,
        tags,
    });

    try {
        const savedItinerary = await newItinerary.save();
        res.status(201).json(savedItinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all itineraries
router.get('/', async (req, res) => {
    try {
        const itineraries = await Itinerary.find().populate('tourGuide');
        res.json(itineraries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a specific itinerary by ID
router.get('/:id', async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id).populate('tourGuide');
        if (itinerary) {
            res.json(itinerary);
        } else {
            res.status(404).json({ error: 'Itinerary not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a specific itinerary by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedItinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedItinerary) {
            res.json(updatedItinerary);
        } else {
            res.status(404).json({ error: 'Itinerary not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a specific itinerary by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
        if (deletedItinerary) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Itinerary not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the router
module.exports = router;
