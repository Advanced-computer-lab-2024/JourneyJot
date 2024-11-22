/** @format */

const express = require('express');
const auth_check = require('../middleware/auth-check');
const {
	requestOTP,
	verifyOTP,
	resetPassword,
} = require('../controllers/request-otp');

const forgetPassword = express.Router();

forgetPassword.post('/request-otp', auth_check, requestOTP);
forgetPassword.post('/verify-otp', auth_check, verifyOTP);
forgetPassword.post('/reset-password', auth_check, resetPassword);
module.exports = forgetPassword;
