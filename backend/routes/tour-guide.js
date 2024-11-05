/** @format */

// routes/userRoutes.js

const express = require('express');

const {
	createTourGuideProfile,
	getTourGuideProfile,
} = require('../controllers/tour-guide');
const auth_check = require('../middleware/auth-check');
const tourGuideCheck = require('../middleware/tour-guide-check');
const { uploadImages, upload } = require('../controllers/upload');
const { changePassword } = require('../helper/change-password');
const { uploadFiles, uploadFile } = require('../controllers/file');
const tourGuideRouter = express.Router();
// Update tour guide profile
tourGuideRouter.put(
	'/profile',
	auth_check,
	tourGuideCheck,
	createTourGuideProfile
);
tourGuideRouter.get(
	'/profile',
	auth_check,
	tourGuideCheck,
	getTourGuideProfile
);

tourGuideRouter.post(
	'/profileUpload',
	auth_check,
	upload.single('image'),
	uploadImages
);
tourGuideRouter.post('/changePassword', auth_check, changePassword);
tourGuideRouter.post(
	'/upload-file',
	auth_check,
	uploadFile.single('file'),
	uploadFiles
);

module.exports = tourGuideRouter;
