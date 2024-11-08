/** @format */

// routes/category.js

const express = require("express");
const categoryRouter = express.Router();
const authCheck = require("../middleware/auth-check");
const adminCheck = require("../middleware/admin-check");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
// Apply authentication to all routes

// Admin routes for managing activity categories
categoryRouter.post("/", authCheck, adminCheck, createCategory); // Create a new category
categoryRouter.get("/", getCategories); // Get all categories
categoryRouter.put("/:id", authCheck, adminCheck, updateCategory); // Update a category
categoryRouter.delete("/:id", authCheck, adminCheck, deleteCategory); // Delete a category

module.exports = categoryRouter;
