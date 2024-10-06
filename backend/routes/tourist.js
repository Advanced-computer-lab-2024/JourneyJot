/** @format */

const { Router } = require('express');
const {
	signUp,
	login,
	getTouristProfile,
	updateTouristProfile,
} = require('../controllers/tourist');
const auth_check = require('../middleware/auth-check');
const touristRouter = Router();

touristRouter.post('/signup', auth_check, signUp);
touristRouter.post('/login', auth_check, login);
touristRouter.get('/profile', auth_check, getTouristProfile);
touristRouter.put('/profile', auth_check, updateTouristProfile);

module.exports = touristRouter;
