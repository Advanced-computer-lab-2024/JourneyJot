/** @format */

// routes/userRoutes.js

const express = require('express');
const auth_check = require('../middleware/auth-check');
const {
	getSellerProfile,
	createSellerProfile,
} = require('../controllers/seller');
const { uploadImages, upload } = require('../controllers/upload');
const { changePassword } = require('../helper/change-password');
const { deleteRequest } = require('../controllers/deletion-request');
const sellerRouter = express.Router();
// Update tour guide profile
sellerRouter.put('/profile', auth_check, createSellerProfile);
sellerRouter.get('/profile', auth_check, getSellerProfile);
sellerRouter.post(
	'/profileUpload',
	auth_check,
	upload.single('image'),
	uploadImages
);
sellerRouter.post('/changePassword', auth_check, changePassword);
sellerRouter.put('/account', auth_check, deleteRequest);

module.exports = sellerRouter;
