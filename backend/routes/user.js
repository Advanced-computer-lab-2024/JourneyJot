/** @format */

const { Router } = require('express');
const { signUp, login } = require('../controllers/user');
const upload = require('../middleware/multerConfig');
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

module.exports = userRouter;
