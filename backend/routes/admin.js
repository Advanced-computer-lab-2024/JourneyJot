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
	viewTourists,
	viewUsersAndTourists,
} = require('../controllers/admin');
const { changePassword } = require('../helper/change-password');
const { flagItinerary, flagActivity } = require('../controllers/flag-events');
const { sendEmailToAdvertiser } = require('../controllers/request-otp');
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
adminRouter.get('/tourists', authMiddleware, adminMiddleware, viewTourists);
adminRouter.get(
	'/users-and-tourists',
	authMiddleware,
	adminMiddleware,
	viewUsersAndTourists
);
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
adminRouter.post('/send-email', sendEmailToAdvertiser);

module.exports = adminRouter;
