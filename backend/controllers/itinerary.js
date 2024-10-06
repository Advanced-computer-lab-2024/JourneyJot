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
    const sortCriteria = {};

    // Determine the sorting criteria based on query parameters
    if (req.query.sortBy) {
      if (req.query.sortBy === "price") {
        sortCriteria.price = req.query.order === "desc" ? -1 : 1; // Ascending or descending sort
      } else if (req.query.sortBy === "ratings") {
        sortCriteria.ratings = req.query.order === "desc" ? -1 : 1; // Ascending or descending sort
      } else {
        return res.status(400).send({
          message: 'Invalid sortBy parameter. Use "price" or "ratings".',
        });
      }
    } else {
      return res.status(400).send({ message: "Missing sortBy parameter." });
    }

    // Fetch all activities and apply sorting
    const itineraries = await Itinerary.find({}).sort(sortCriteria);

    // Return the sorted result
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
