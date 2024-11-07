/** @format */

const { Router } = require("express");
const {
  signUp,
  login,
  getTouristProfile,
  updateTouristProfile,
  getTouristID,
  buyProduct,
  getTouristPointsAndLevel,
  redeemPoints, // Import redeemPoints function here
  getTouristProductHistory,
  TouristReviewProduct,
  TouristBookActivity,
  TouristBookAttraction,
  TouristBookItinerary,
  getTouristData,
} = require("../controllers/tourist");
const auth_check = require("../middleware/auth-check");
const { changePassword } = require("../helper/tourist-change-password");

const touristRouter = Router();

touristRouter.post('/signup', signUp);
touristRouter.post('/login', login);
touristRouter.get('/profile', auth_check, getTouristProfile, getTouristPointsAndLevel);
touristRouter.put('/profile', auth_check, updateTouristProfile);
touristRouter.post('/changePassword', auth_check, changePassword);

// Route to redeem points
touristRouter.post('/redeemPoints', auth_check, redeemPoints);

module.exports = touristRouter;
