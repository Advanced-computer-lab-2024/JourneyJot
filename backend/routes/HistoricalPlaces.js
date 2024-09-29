import express from "express";
import HistoricalPlace from "../models/HistoricalPlacesSchema.js"; 

const router = express.Router();


router.post("/historical-places", async (req, res) => {
  const { name, location, description, openingHours, ticketPrices, pictures } = req.body;

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

router.get("/historical-places", async (req, res) => {
  try {
    const historicalPlaces = await HistoricalPlace.find();
    res.status(200).json(historicalPlaces);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/historical-places/:id", async (req, res) => {
  const { name, location, description, openingHours, ticketPrices, pictures } = req.body;

  try {
    const historicalPlace = await HistoricalPlace.findByIdAndUpdate(
      req.params.id,
      { name, location, description, openingHours, ticketPrices, pictures },
      { new: true }
    );
    if (!historicalPlace) return res.status(404).json({ message: "Historical Place not found" });
    res.status(200).json(historicalPlace);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/historical-places/:id", async (req, res) => {
  try {
    const historicalPlace = await HistoricalPlace.findByIdAndDelete(req.params.id);
    if (!historicalPlace) return res.status(404).json({ message: "Historical Place not found" });
    res.status(200).json({ message: "Historical Place deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router; 
