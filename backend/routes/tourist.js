/** @format */

const { Router } = require('express');
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
} = require('../controllers/tourist');
const auth_check = require('../middleware/auth-check');
const { changePassword } = require('../helper/tourist-change-password');
const {
	addReview,
	getReviewsByTourGuide,
} = require('../controllers/review-event');

const touristRouter = Router();

touristRouter.post('/signup', signUp);
touristRouter.post('/login', login);
touristRouter.get('/profile', auth_check, getTouristProfile);
touristRouter.put('/profile', auth_check, updateTouristProfile);
touristRouter.post('/changePassword', auth_check, changePassword);
touristRouter.get('/getTouristID', auth_check, getTouristID);
touristRouter.post('/buyProduct', auth_check, buyProduct);
touristRouter.get('/productHistory', auth_check, getTouristProductHistory);
touristRouter.post('/review', auth_check, TouristReviewProduct);
touristRouter.post('/bookActivity', auth_check, TouristBookActivity);
touristRouter.post('/bookAttraction', auth_check, TouristBookAttraction);
touristRouter.post('/bookItinerary', auth_check, TouristBookItinerary);
touristRouter.get('/getTourist', auth_check, getTouristData);
touristRouter.post('/reviews', addReview);
touristRouter.get('/reviews/:tourGuideId', getReviewsByTourGuide);

module.exports = touristRouter;
