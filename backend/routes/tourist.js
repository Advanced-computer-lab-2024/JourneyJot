/** @format */

const { Router } = require("express");
const {
<<<<<<< HEAD
  signUp,
  login,
  getTouristProfile,
  updateTouristProfile,
  getTouristID,
  buyProduct,
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

touristRouter.post("/signup", signUp);
touristRouter.post("/login", login);
touristRouter.get("/profile", auth_check, getTouristProfile);
touristRouter.put("/profile", auth_check, updateTouristProfile);
touristRouter.post("/changePassword", auth_check, changePassword);
touristRouter.get("/getTouristID", auth_check, getTouristID);
touristRouter.post("/buyProduct", auth_check, buyProduct);
touristRouter.get("/productHistory", auth_check, getTouristProductHistory);
touristRouter.post("/review", auth_check, TouristReviewProduct);
touristRouter.post("/bookActivity", auth_check, TouristBookActivity);
touristRouter.post("/bookAttraction", auth_check, TouristBookAttraction);
touristRouter.post("/bookItinerary", auth_check, TouristBookItinerary);
touristRouter.get("/getTourist", auth_check, getTouristData);
=======
	signUp,
	login,
	getTouristProfile,
	updateTouristProfile,
	rateActivity,
	commentOnActivity,
	rateTourGuide,
	commentOnTourGuide,
	rateItinerary,
	 commentOnItinerary,  
} = require('../controllers/tourist');
const auth_check = require('../middleware/auth-check');
const { changePassword } = require('../helper/tourist-change-password');

const touristRouter = Router();

touristRouter.post('/signup', signUp);
touristRouter.post('/login', login);
touristRouter.get('/profile', auth_check, getTouristProfile);
touristRouter.put('/profile', auth_check, updateTouristProfile);
touristRouter.post('/changePassword', auth_check, changePassword);
touristRouter.post('/rate-activity', auth_check, rateActivity);
touristRouter.post('/comment-activity', auth_check, commentOnActivity);
touristRouter.post('/rate-tour-guide', auth_check, rateTourGuide);
touristRouter.post('/comment-tour-guide', auth_check, commentOnTourGuide);
touristRouter.post('/rate-itinerary', auth_check, rateItinerary);
touristRouter.post('/comment-itinerary', auth_check, commentOnItinerary);
>>>>>>> main

module.exports = touristRouter;
