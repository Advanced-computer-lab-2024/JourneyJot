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
const {
	sendEmailToAdvertiser,
	sendEmailToTourGuide,
} = require('../controllers/request-otp');
const {
	updateStock,
	getNotifications,
} = require('../controllers/notification');
const {
	getPromoCodes,
	createPromoCode,
	deletePromoCode,
} = require('../controllers/promocode');

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
adminRouter.post('/send-email-advertiser', sendEmailToAdvertiser);
adminRouter.post('/send-email-tour-guide', sendEmailToTourGuide);
adminRouter.post('/update-stock', authMiddleware, updateStock);
adminRouter.get('/notifications', authMiddleware, getNotifications);
adminRouter.post(
	'/promo-codes',
	authMiddleware,
	adminMiddleware,
	createPromoCode
);
adminRouter.get('/promo-codes', authMiddleware, adminMiddleware, getPromoCodes);
adminRouter.delete(
	'/promo-codes/:id',
	authMiddleware,
	adminMiddleware,
	deletePromoCode
);

module.exports = adminRouter;
