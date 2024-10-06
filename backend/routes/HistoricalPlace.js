const express = require('express');
const HistoricalPlace = require('../models/HistoricalPlace');
const router = express.Router();

// Filter Historical Places by tags
router.get('/', async (req, res) => {
    try {
        const { tags } = req.query;

        // Prepare a query object
        const query = {};

        // Check if tags are provided
        if (tags) {
            // Split the tags by commas and create a regular expression for filtering
            const tagsArray = tags.split(',').map(tag => tag.trim());
            query.tags = { $in: tagsArray }; // Find any historical places with tags in the provided list
        }

        // Fetch historical places based on the constructed query
        const historicalPlaces = await HistoricalPlace.find(query);

        // Send the response
        return res.status(200).json({ count: historicalPlaces.length, data: historicalPlaces });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});
// Get Historical Places with optional filtering by tags
router.get('/historical-places', async (req, res) => {
    try {
        const { tags } = req.query;

        // Build the filter object
        let filter = {};

        if (tags) {
            filter.tags = { $in: tags.split(',') }; // Filter for specific tags
        }

        const historicalPlaces = await HistoricalPlace.find(filter);
        res.json(historicalPlaces);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;
