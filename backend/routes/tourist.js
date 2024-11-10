/** @format */

const { Router } = require("express");
const {
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
	updateTouristPoints,
	getTouristPoints,
	getWalletBalance,
	addFundsToWallet,
	redeemPointsToWallet,
	requestAccountDeletion,
	cancelItinerary,
	cancelActivity,
	cancelAttraction,
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
// Points management routes
touristRouter.post("/updatePoints", auth_check, updateTouristPoints); // New route for updating points with multiplier
touristRouter.get("/points", auth_check, getTouristPoints); // New route for viewing points and level
touristRouter.get("/wallet", auth_check, getWalletBalance);

touristRouter.post("/wallet/addFunds", auth_check, addFundsToWallet);
touristRouter.post("/redeemPoints", auth_check, redeemPointsToWallet);
touristRouter.post("/deleteAccount", auth_check, requestAccountDeletion);
touristRouter.post('/cancelActivity/:activityId', auth_check, cancelActivity);
touristRouter.post('/cancelItinerary/:itineraryId', auth_check, cancelItinerary);
touristRouter.post('/cancelAttraction/:attractionId', auth_check, cancelAttraction);

module.exports = touristRouter;
