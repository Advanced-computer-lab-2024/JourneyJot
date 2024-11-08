
const Itinerary = require("../models/TouristItinerary.js");


exports.addItinerary = async (req, res) => {
  try {
    const { activities, locations, startDate, endDate, tags } = req.body;
    const itinerary = new Itinerary({
      activities,
      locations,
      startDate,
      endDate,
      tags,
    });
    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create itinerary" });
  }
};

exports.getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch itineraries" });
  }
};

exports.updatedItinerary = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json(updatedItinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update itinerary" });
  }
};

exports.deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete itinerary" });
  }
};
