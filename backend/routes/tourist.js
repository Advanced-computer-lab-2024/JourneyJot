/** @format */

const { Router } = require('express');
const {
  signUp,
  login,
  getTouristProfile,
  updateTouristProfile,
  getTouristPointsAndLevel,
  redeemPoints, // Import redeemPoints function here
} = require('../controllers/tourist');
const auth_check = require('../middleware/auth-check');
const { changePassword } = require('../helper/tourist-change-password');

const touristRouter = Router();

touristRouter.post('/signup', signUp);
touristRouter.post('/login', login);
touristRouter.get('/profile', auth_check, getTouristProfile);
touristRouter.put('/profile', auth_check, updateTouristProfile);
touristRouter.post('/changePassword', auth_check, changePassword);
touristRouter.get('/points', auth_check, getTouristPointsAndLevel); // Added points route
touristRouter.post('/redeemPoints', auth_check, redeemPoints); // Added redeem points route

module.exports = touristRouter;
