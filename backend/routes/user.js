/** @format */

const { Router } = require('express');
const { signUp, login } = require('../controllers/user');
const userRouter = Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);

module.exports = userRouter;
