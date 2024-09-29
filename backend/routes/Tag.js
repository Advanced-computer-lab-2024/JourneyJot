const express = require("express");
const Tag = require("../models/Tag"); // Adjust path as necessary

const router = express.Router();

// CREATE a new tag
router.post("/tags", async (req, res) => {
  const { name, type, historicalPeriod } = req.body;

  try {
    const tag = new Tag({ name, type, historicalPeriod });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all tags
router.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a tag by ID
router.put("/tags/:id", async (req, res) => {
  const { name, type, historicalPeriod } = req.body;

  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name, type, historicalPeriod },
      { new: true }
    );
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a tag by ID
router.delete("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
