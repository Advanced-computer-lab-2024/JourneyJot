const express = require("express");
const HistoricalPlace = require("../models/HistoricalPlacesSchema.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, location, description, openingHours, ticketPrices, pictures } =
    req.body;

  try {
    const historicalPlace = new HistoricalPlace({
      name,
      location,
      description,
      openingHours,
      ticketPrices,
      pictures,
    });
    await historicalPlace.save();
    res.status(201).json(historicalPlace);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const { category, tag, name } = req.query; // Get category, tag, and name from query parameters

  try {
    // Build a query object with the available parameters
    const query = {};

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag; // Assuming `tags` is an array of strings
    }

    if (name) {
      query.description = { $regex: name, $options: "i" }; // Case-insensitive search for historicalPlaces names
    }

    // Find historicalPlaces that match the query (any combination of category, tag, or name)
    const historicalPlaces = await HistoricalPlace.find(query);

    if (historicalPlaces.length === 0) {
      return res
        .status(404)
        .json({ message: "No historicalPlaces found for the given criteria" });
    }

    res.json(historicalPlaces); // Send the results back
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching historicalPlaces" });
  }
});

router.put("/:id", async (req, res) => {
  const { name, location, description, openingHours, ticketPrices, pictures } =
    req.body;

  try {
    const historicalPlace = await HistoricalPlace.findByIdAndUpdate(
      req.params.id,
      { name, location, description, openingHours, ticketPrices, pictures },
      { new: true }
    );
    if (!historicalPlace)
      return res.status(404).json({ message: "Historical Place not found" });
    res.status(200).json(historicalPlace);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const historicalPlace = await HistoricalPlace.findByIdAndDelete(
      req.params.id
    );
    if (!historicalPlace)
      return res.status(404).json({ message: "Historical Place not found" });
    res.status(200).json({ message: "Historical Place deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
