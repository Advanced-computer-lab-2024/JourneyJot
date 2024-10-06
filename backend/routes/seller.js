/** @format */

// routes/userRoutes.js

const express = require('express');
const auth_check = require('../middleware/auth-check');
const {
	getSellerProfile,
	createSellerProfile,
} = require('../controllers/seller');
const sellerRouter = express.Router();
// Update tour guide profile
sellerRouter.put('/profile', auth_check, createSellerProfile);
sellerRouter.get('/profile', auth_check, getSellerProfile);

module.exports = sellerRouter;
