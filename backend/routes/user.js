/** @format */

const { Router } = require('express');
const { signUp, login } = require('../controllers/user');
const upload = require('../middleware/multerConfig');
const {
	requestOTP,
	verifyOTP,
	resetPassword,
} = require('../controllers/request-otp');
const userRouter = Router();

userRouter.post(
	'/signUp',
	upload.fields([
		{ name: 'idFile', maxCount: 1 },
		{ name: 'additionalFiles', maxCount: 5 },
	]),
	signUp
);

userRouter.post('/login', login);
userRouter.post('/request-otp', requestOTP);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/reset-password', resetPassword);

module.exports = userRouter;
