const express = require("express");
const Museum = require("../models/MusuemsSchema.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, location, openingHours, ticketPrices, description, pictures } =
    req.body;

  try {
    const museum = new Museum({
      name,
      location,
      openingHours,
      ticketPrices,
      description,
      pictures,
    });
    await museum.save();
    res.status(201).json(museum);
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
      query.description = { $regex: name, $options: "i" }; // Case-insensitive search for museum names
    }

    // Find museums that match the query (any combination of category, tag, or name)
    const museums = await Museum.find(query);

    if (museums.length === 0) {
      return res
        .status(404)
        .json({ message: "No museums found for the given criteria" });
    }

    res.json(museums); // Send the results back
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching museums" });
  }
});

router.put("/:id", async (req, res) => {
  const { name, location, openingHours, ticketPrices, description } = req.body;

  try {
    const museum = await Museum.findByIdAndUpdate(
      req.params.id,
      { name, location, openingHours, ticketPrices, description },
      { new: true }
    );
    if (!museum) return res.status(404).json({ message: "Museum not found" });
    res.status(200).json(museum);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const museum = await Museum.findByIdAndDelete(req.params.id);
    if (!museum) return res.status(404).json({ message: "Museum not found" });
    res.status(200).json({ message: "Museum deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
