/** @format */

// controllers/activityController.js

const Activity = require("../models/Activity");

// Create a new activity
exports.createActivity = async (req, res) => {
  try {
    const activity = new Activity({
      ...req.body,
      advertiserId: req.user._id, // Assuming req.user is set after authentication
    });
    await activity.save();
    return res
      .status(201)
      .json({ message: "Activity created successfully", activity });
  } catch (error) {
    return res.status(500).json({ message: "Error creating activity", error });
  }
};

// Get all activities
exports.getActivities = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const activities = await Activity.find(query);
    res.status(200).json({ activities });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await Activity.findById(id);
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
    const activities = await Activity.find(query);

    // Return the result
    return res.status(200).json({ count: activities.length, data: activities });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
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
    const activities = await Activity.find({}).sort(sortCriteria);

    // Return the sorted result
    return res.status(200).json({ count: activities.length, data: activities });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
