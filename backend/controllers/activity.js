/** @format */

// controllers/activityController.js

const Activity = require("../models/Activity");

// Create a new activity
exports.createActivity = async (req, res) => {
  try {
    const formattedDate = new Date(req.body.date).toISOString().split("T")[0];
    const activity = new Activity({
      date: formattedDate,
      time: req.body.time,
      price: req.body.price,
      priceRange: req.body.priceRange,
      category: req.body.category,
      tags: req.body.tags,
      specialDiscounts: req.body.specialDiscounts,
      bookingOpen: req.body.bookingOpen,
      rating: req.body.rating,
      // advertiserId: req.user._id,
    });
    await activity.save();
    return res
      .status(201)
      .json({ message: "Activity created successfully", activity });
  } catch (error) {
    console.log(req.user);
    console.log(error);
    return res.status(500).json({ message: "Error creating activity", error });
  }
};

// Get all activities
exports.getActivities = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const activities = await Activity.find(query).populate("category tags");
    res.status(200).json({ activities });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await Activity.findById(id).populate(
      "advertiserId category tags"
    );
    return res.status(200).json(activity);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching activities", error });
  }
};

// Update an activity
exports.updateActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await Activity.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    return res
      .status(200)
      .json({ message: "Activity updated successfully", activity });
  } catch (error) {
    return res.status(500).json({ message: "Error updating activity", error });
  }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    return res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting activity", error });
  }
};

exports.getFilteredActivities = async (req, res) => {
  try {
    const query = {};

    // Add filters based on query parameters
    if (req.query.price) {
      query.price = { $lte: req.query.price }; // Less than or equal to budget
    }

    if (req.query.date) {
      query.date = { $gte: new Date(req.query.date) }; // On or after the specified date
    }

    if (req.query.category) {
      query.category = req.query.category; // Exact category match
    }

    if (req.query.ratings) {
      query.ratings = { $gte: req.query.ratings }; // Greater than or equal to specified rating
    }

    // Fetch filtered activities
    const activities = await Activity.find(query).populate("category, tags");

    // Return the result
    return res.status(200).json({ count: activities.length, data: activities });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.sortByPriceOrRating = async (req, res) => {
  try {
    const { type } = req.query;
    let sortCriteria = {};

    if (type === "price") {
      sortCriteria.price = 1; // Sort by price in ascending order
    } else if (type === "rating") {
      sortCriteria.ratings = -1; // Sort by ratings in descending order
    } else {
      return res.status(400).json({ message: "Invalid sort type" });
    }

    const activities = await Activity.find()
      .sort(sortCriteria)
      .populate("category, tags");
    return res.status(200).json({ count: activities.length, data: activities });
  } catch (error) {
    return res.status(500).json({ message: "Error sorting activities", error });
  }
};
