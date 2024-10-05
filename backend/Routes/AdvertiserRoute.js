// routes/AdvertiserRoute.js
const express = require('express');
const router = express.Router();
const Advertiser = require('../models/Advertiser');

// Create a new advertiser profile
router.post('/', async (req, res) => {
    const { companyName, website, hotline, companyProfile, accepted } = req.body;

    const newAdvertiser = new Advertiser({
        companyName,
        website,
        hotline,
        companyProfile,
        accepted,
    });

    try {
        const savedProfile = await newAdvertiser.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all advertiser profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Advertiser.find();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a specific advertiser profile by ID
router.get('/:id', async (req, res) => {
    try {
        const profile = await Advertiser.findById(req.params.id);
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a specific advertiser profile by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProfile = await Advertiser.findByIdAndUpdate(req.params.id, req.body, { new: true });
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