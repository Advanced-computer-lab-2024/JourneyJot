/** @format */

const adminCheck = require('../middleware/admin-check');
const authCheck = require('../middleware/auth-check');
const express = require('express');
const adminController = require('../controllers/preference-tag');
const preferenceTagRouter = express.Router();

// Ensure only admin can access these routes
preferenceTagRouter.post(
	'/',
	authCheck,
	adminCheck,
	adminController.createPreferenceTag
);
preferenceTagRouter.get(
	'/',
	authCheck,
	adminCheck,
	adminController.getAllPreferenceTags
);
preferenceTagRouter.put(
	'/:id',
	authCheck,
	adminCheck,
	adminController.updatePreferenceTag
);
preferenceTagRouter.delete(
	'/:id',
	authCheck,
	adminCheck,
	adminController.deletePreferenceTag
);

module.exports = preferenceTagRouter;
