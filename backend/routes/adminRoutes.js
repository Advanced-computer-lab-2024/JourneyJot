/** @format */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Route to delete a user
router.delete(
	'/users/:userType/:id',
	authenticateAdmin,
	adminController.deleteUser
);

// New route to add a Tourism Governor
router.post(
	'/users/TourismGovernor',
	authenticateAdmin,
	adminController.addTourismGovernor
);

// New route to add an Admin
router.post('/users/Admin', authenticateAdmin, adminController.addAdmin);

module.exports = router;
