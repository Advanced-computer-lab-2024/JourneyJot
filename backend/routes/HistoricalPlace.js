const express = require("express");
const HistoricalPlace = require("../models/HistoricalPlace");
const router = express.Router();

// Filter Historical Places by tags
router.get("/", async (req, res) => {
  try {
    const historicalPlaces = await HistoricalPlace.find();
    res.json(historicalPlaces);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Get Historical Places with optional filtering by tags
router.get("/filter", async (req, res) => {
  try {
    const { tags } = req.query;

    // Build the filter object
    let filter = {};

    if (tags) {
      filter.tags = { $in: tags.split(",") }; // Filter for specific tags
    }

    const historicalPlaces = await HistoricalPlace.find(filter);
    res.json(historicalPlaces);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
