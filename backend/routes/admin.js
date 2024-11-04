/** @format */

const express = require('express');
const adminRouter = express.Router();
const authMiddleware = require('../middleware/auth-check');
const adminMiddleware = require('../middleware/admin-check');
const {
	deleteAccount,
	addGovernor,
	addAdmin,
} = require('../controllers/admin');
const { changePassword } = require('../helper/change-password');
adminRouter.delete(
	'/delete-account/:username',
	authMiddleware,
	adminMiddleware,
	deleteAccount
);
adminRouter.post('/addGovernor', authMiddleware, adminMiddleware, addGovernor);
adminRouter.post('/addAdmin', authMiddleware, adminMiddleware, addAdmin);
adminRouter.post('/changePassword', authMiddleware, changePassword);

module.exports = adminRouter;
