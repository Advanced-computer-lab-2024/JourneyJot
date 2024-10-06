// routes/ItineraryRoute.js
const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');

// Create a new itinerary
router.post('/', async (req, res) => {
    const { title, activities, dateRange, createdBy } = req.body;

    try {
        const newItinerary = new Itinerary({ title, activities, dateRange, createdBy });
        await newItinerary.save();
        res.status(201).json(newItinerary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all itineraries
router.get('/', async (req, res) => {
    try {
        const itineraries = await Itinerary.find().populate('createdBy', 'username');
        res.json(itineraries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific itinerary by ID
router.get('/:id', async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id).populate('createdBy', 'username');
        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
        res.json(itinerary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an itinerary
router.put('/:id', async (req, res) => {
    try {
        const updatedItinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItinerary) return res.status(404).json({ message: 'Itinerary not found' });
        res.json(updatedItinerary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an itinerary
router.delete('/:id', async (req, res) => {
    try {
        const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
        if (!deletedItinerary) return res.status(404).json({ message: 'Itinerary not found' });
        res.json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;