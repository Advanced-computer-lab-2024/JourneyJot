import express from "express";
import Museum from "../models/MuseumsSchema.js";

const router = express.Router();

router.post("/museums", async (req, res) => {
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

router.get("/museums", async (req, res) => {
  try {
    const museums = await Museum.find();
    res.status(200).json(museums);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/museums/:id", async (req, res) => {
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

router.delete("/museums/:id", async (req, res) => {
  try {
    const museum = await Museum.findByIdAndDelete(req.params.id);
    if (!museum) return res.status(404).json({ message: "Museum not found" });
    res.status(200).json({ message: "Museum deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
