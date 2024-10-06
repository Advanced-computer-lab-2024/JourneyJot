/** @format */

// routes/tagRoutes.js

const express = require('express');
const { createTag, getTags } = require('../controllers/tags');
const authenticate = require('../middleware/auth-check'); // Assuming you have an auth middleware
const roleCheck = require('../middleware/governor-check'); // Check if user is a tourism governor

const tagRouter = express.Router();

tagRouter.post('/', authenticate, roleCheck, createTag); // Create tag
tagRouter.get('/', authenticate, roleCheck, getTags); // Get all tags

module.exports = tagRouter;
