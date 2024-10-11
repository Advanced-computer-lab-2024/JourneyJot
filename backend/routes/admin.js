/** @format */

const express = require('express');
const adminRouter = express.Router();
const authMiddleware = require('../middleware/auth-check');
const adminMiddleware = require('../middleware/admin-check');
const {
	deleteAccount,
	addGovernor,
	addAdmin,
	viewAdmins,
} = require('../controllers/admin');
adminRouter.delete(
	'/delete-account/:username',
	authMiddleware,
	adminMiddleware,
	deleteAccount
);
adminRouter.post('/addGovernor', authMiddleware, adminMiddleware, addGovernor);
adminRouter.post('/addAdmin', authMiddleware, adminMiddleware, addAdmin);

module.exports = adminRouter;
