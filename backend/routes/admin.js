/** @format */

const express = require('express');
const adminRouter = express.Router();
const authMiddleware = require('../middleware/auth-check');
const adminMiddleware = require('../middleware/admin-check');
const {
	deleteAccount,
	addGovernor,
	addAdmin,
	getPendingUsers,
	updateUserStatus,
	viewUsers,
} = require('../controllers/admin');
const { changePassword } = require('../helper/change-password');
const { flagItinerary, flagActivity } = require('../controllers/flag-events');
adminRouter.delete(
	'/delete-account/:username',
	authMiddleware,
	adminMiddleware,
	deleteAccount
);
adminRouter.post('/addGovernor', authMiddleware, adminMiddleware, addGovernor);
adminRouter.post('/addAdmin', authMiddleware, adminMiddleware, addAdmin);
adminRouter.post('/changePassword', authMiddleware, changePassword);
// Get all pending users
adminRouter.get(
	'/pending-users',
	authMiddleware,
	adminMiddleware,
	getPendingUsers
);

// Update user status
adminRouter.put(
	'/update-user-status/:userId',
	authMiddleware,
	updateUserStatus
);
adminRouter.get('/users', authMiddleware, adminMiddleware, viewUsers);
adminRouter.put(
	'/itineraries/:id',
	authMiddleware,
	adminMiddleware,
	flagItinerary
);
adminRouter.put(
	'/activities/:id',
	authMiddleware,
	adminMiddleware,
	flagActivity
);

module.exports = adminRouter;
