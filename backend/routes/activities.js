/** @format */

// routes/activityRoutes.js

const express = require("express");
const {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
  getActivity,
  getFilteredActivities,
  sortByPriceOrRating,
  getCompletedActivities,
} = require("../controllers/activity");
const authenticate = require("../middleware/auth-check"); // Assuming you have an auth middleware
const advertiserCheck = require("../middleware/advertiser-check");
const activityRouter = express.Router();

activityRouter.post("/", authenticate, advertiserCheck, createActivity); // Create activity
activityRouter.get("/", getActivities); // Get all activities
activityRouter.put("/:id", authenticate, advertiserCheck, updateActivity); // Update activity
activityRouter.delete("/:id", authenticate, advertiserCheck, deleteActivity); // Delete activity
activityRouter.get("/filter", getFilteredActivities); // Filter activities
activityRouter.get("/sort", sortByPriceOrRating); // Sort activities
activityRouter.get("/:id", getActivity); // Get single activity by id
activityRouter.get("/kr/:id", getCompletedActivities);

module.exports = activityRouter;
