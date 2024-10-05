// routes/TourGuideRoute.js
const express = require('express');
const router = express.Router();
const TourGuide = require('../models/TourGuide');

// Create a new tour guide profile
router.post('/', async (req, res) => {
    const { name, mobile, experience, previousWork, accepted } = req.body;

    const newGuide = new TourGuide({
        name,
        mobile,
        experience,
        previousWork,
        accepted,
    });

    try {
        const savedProfile = await newGuide.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all tour guide profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await TourGuide.find();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a specific tour guide profile by ID
router.get('/:id', async (req, res) => {
    try {
        const profile = await TourGuide.findById(req.params.id);
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a specific tour guide profile by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProfile = await TourGuide.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedProfile) {
            res.json(updatedProfile);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Export the router
module.exports = router;