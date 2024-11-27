/** @format */

// routes/userRoutes.js

const express = require('express');
const auth_check = require('../middleware/auth-check');
const {
	createAdvertiserProfile,
	getAdvertiserProfile,
} = require('../controllers/advertiser');
const { uploadImages, upload } = require('../controllers/upload');
const { changePassword } = require('../helper/change-password');
const { deleteRequest } = require('../controllers/deletion-request');
const {
	requestOTP,
	verifyOTP,
	resetPassword,
} = require('../controllers/request-otp');
const {
	getNotifications,
	markAsRead,
	checkAllActivitiesForFlags,
} = require('../controllers/activity');
const { getTouristCountByMonthForActivity } = require('../controllers/tourist');
const advertiserRouter = express.Router();
// Update tour guide profile
advertiserRouter.put('/profile', auth_check, createAdvertiserProfile);
advertiserRouter.get('/profile', auth_check, getAdvertiserProfile);
advertiserRouter.post(
	'/profileUpload',
	auth_check,
	upload.single('image'),
	uploadImages
);
advertiserRouter.post('/changePassword', auth_check, changePassword);
advertiserRouter.put('/account', auth_check, deleteRequest);
advertiserRouter.get('/notifications', checkAllActivitiesForFlags);
advertiserRouter.get('/countByMonth', getTouristCountByMonthForActivity);

module.exports = advertiserRouter;
