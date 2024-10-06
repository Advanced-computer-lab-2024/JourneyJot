//** @format */

const express = require("express");
const Activity = require("../models/Activity");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post("/", async (req, res) => {
  try {
    // Check if all required fields are present in the request body
    if (
      !req.body.title ||
      !req.body.date ||
      !req.body.time ||
      !req.body.location ||
      !req.body.price ||
      !req.body.category ||
      !req.body.tags ||
      !req.body.specialDiscounts ||
      !req.body.bookingOpen
    ) {
      return res.status(400).send({ message: "Send All Required Fields" });
    }

    // Create a new activity object
    const newActivity = {
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      price: req.body.price,
      category: req.body.category,
      tags: req.body.tags,
      specialDiscounts: req.body.specialDiscounts,
      bookingOpen: req.body.bookingOpen,
    };

    // Save the activity to the database
    const activity = await Activity.create(newActivity);
    return res.status(200).send(activity);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all activities with optional filters and sorting
router.get("/filter", async (req, res) => {
  try {
    const query = {};

    // Add filters based on query parameters
    if (req.query.budget) {
      query.price = { $lte: req.query.budget }; // Less than or equal to budget
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
});

// Sort activities based on price or ratings
router.get("/sort", async (req, res) => {
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
});

// Get a specific activity by ID
router.get("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an activity by ID
router.put("/:id", async (req, res) => {
  try {
    // Check if all required fields are present
    if (
      !req.body.title ||
      !req.body.date ||
      !req.body.time ||
      !req.body.location ||
      !req.body.price ||
      !req.body.category ||
      !req.body.tags ||
      !req.body.specialDiscounts ||
      !req.body.bookingOpen
    ) {
      return res.status(400).send({ message: "Send All Required Fields" });
    }

    // Update the activity
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedActivity) {
      return res.status(400).send({ message: "Activity not Updated" });
    }

    // Return success message
    return res
      .status(200)
      .send({ message: "Activity Updated", updatedActivity });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Delete an activity by ID
router.delete("/:id", async (req, res) => {
  try {
    // Find and delete the activity
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
    if (!deletedActivity) {
      return res.status(400).send({ message: "Activity not Deleted" });
    }

    // Return success message
    return res.status(200).send({ message: "Activity Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
