/** @format */

// controllers/itineraryController.js

const Itinerary = require("../models/Itinerary");

exports.createItinerary = async (req, res) => {
  try {
    const newItinerary = new Itinerary({
      tourGuideId: req.user._id,
      ...req.body, // Spread the body data into the new itinerary
    });
    await newItinerary.save();
    res.status(201).json({
      message: "Itinerary created successfully",
      itinerary: newItinerary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating itinerary", error });
  }
};

exports.getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({});
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching itineraries", error });
  }
};
exports.getItinerary = async (req, res) => {
  const { id } = req.params;
  try {
    const itineraries = await Itinerary.findById(id);
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching itineraries", error });
  }
};

exports.updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItinerary = await Itinerary.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedItinerary)
      return res.status(404).json({ message: "Itinerary not found" });
    res.status(200).json({
      message: "Itinerary updated successfully",
      itinerary: updatedItinerary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating itinerary", error });
  }
};

exports.deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItinerary = await Itinerary.findByIdAndDelete(id);
    if (!deletedItinerary)
      return res.status(404).json({ message: "Itinerary not found" });
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting itinerary", error });
  }
};

exports.sortByPriceOrRating = async (req, res) => {
  try {
    const filterCriteria = {};

    // Check for price in query parameters and filter for itineraries with a price less than the given number
    if (req.query.price) {
      const maxPrice = parseFloat(req.query.price);
      if (!isNaN(maxPrice)) {
        filterCriteria.price = { $lt: maxPrice }; // Less than the given price
      } else {
        return res.status(400).send({ message: "Invalid price format." });
      }
    }

    // Check for ratings in query parameters and filter by ratings greater than or equal to the given value
    if (req.query.ratings) {
      const minRating = parseFloat(req.query.ratings);
      if (!isNaN(minRating)) {
        filterCriteria.ratings = { $gte: minRating }; // Minimum rating filter
      } else {
        return res.status(400).send({ message: "Invalid ratings format." });
      }
    }

    // Fetch itineraries based on the filtering criteria
    const itineraries = await Itinerary.find(filterCriteria);

    // Return the filtered result
    return res
      .status(200)
      .json({ count: itineraries.length, data: itineraries });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.filterItineraries = async (req, res) => {
  try {
    const { budget, date, preferences, language } = req.query;

    // Build the filter object
    let filter = {};

    if (budget) {
      filter.price = { $lte: Number(budget) }; // Filter for budget less than or equal to specified amount
    }

    if (date) {
      filter.date = { $gte: new Date(date) }; // Filter for itineraries on or after the specified date
    }

    if (preferences) {
      filter.preferences = { $in: preferences.split(",") }; // Filter for specific preferences
    }

    if (language) {
      filter.language = language; // Filter for specific language
    }

    const itineraries = await Itinerary.find(filter);
    res.json(itineraries);
  } catch (error) {
    res.status(500).send(error);
  }
};
