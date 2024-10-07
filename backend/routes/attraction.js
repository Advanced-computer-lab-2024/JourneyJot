/** @format */

// routes/attractionRoutes.js

const express = require("express");
const {
  createAttraction,
  getAttractions,
  updateAttraction,
  deleteAttraction,
  getAttraction,
  filterAttractionsByTag,
} = require("../controllers/attractions");
const authenticate = require("../middleware/auth-check"); // Assuming you have an auth middleware
const roleCheck = require("../middleware/governor-check"); // Check if user is a tourism governor
const viewList = require("../middleware/view-list");

const attractionRouter = express.Router();

attractionRouter.post("/", createAttraction); // Create attraction
attractionRouter.get("/", getAttractions); // Get all attractions
attractionRouter.get("/filter", filterAttractionsByTag); // Filter attractions by tags
attractionRouter.get("/:id", getAttraction); // Get one attractions
attractionRouter.put("/:id", updateAttraction); // Update attraction
attractionRouter.delete("/:id", deleteAttraction); // Delete attraction

module.exports = attractionRouter;
