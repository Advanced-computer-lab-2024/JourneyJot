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
	getCompletedItineraries,
	getCompletedActivities,
	reviewTourGuide,
	updateTouristPoints,
	getTouristPoints,
	getWalletBalance,
	addFundsToWallet,
	redeemPointsToWallet,
	requestAccountDeletion,
	cancelItinerary,
	cancelActivity,
	cancelAttraction,
	bookTransportation,
	getBookedTransportations,
	cancelBooking,
	getCompletedItinerariesAndTourists,
	getCompletedActivitiesAndTourists,
	payStripe,
	addProductToWishList,
	getTouristWishList,
	removeProductFromWishList,
	addProductToCart,
	getTouristCart,
	updateCartItemQuantity,
	removeCartItem,
	payStripeActivity,
	payStripeItinerary,
	buyProducts,
	buyProductsCard,
	buyProductsCardVisa,
	getPreviousPurchases,
	cancelOrder,
	bookmarkActivity,
	bookmarkItinerary,
	bookmarkAttraction,
	getBookmarks,
	removeBookmark,
	getTouristNotifications,
	getTouristItineraryNotifications,
	getTouristActivityNotifications,
	getPromoCodesForTourist,
} = require('../controllers/tourist');
const auth_check = require('../middleware/auth-check');
const { changePassword } = require('../helper/tourist-change-password');
const {
	addReview,
	getReviewsByTourGuide,
} = require('../controllers/review-event');
const { deleteRequest } = require('../controllers/deletion-request');

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
touristRouter.get('/completedItineraries', auth_check, getCompletedItineraries);
touristRouter.get('/completedActivities', auth_check, getCompletedActivities);
touristRouter.get(
	'/completedItinerariesAndTourists',
	auth_check,
	getCompletedItinerariesAndTourists
);
touristRouter.get(
	'/completedActivitiesAndTourists',
	auth_check,
	getCompletedActivitiesAndTourists
);
touristRouter.post('/reviewTourGuide/:id', auth_check, reviewTourGuide);
touristRouter.post('/updatePoints', auth_check, updateTouristPoints); // New route for updating points with multiplier
touristRouter.get('/points', auth_check, getTouristPoints); // New route for viewing points and level
touristRouter.get('/wallet', auth_check, getWalletBalance);
touristRouter.post('/wallet/addFunds', auth_check, addFundsToWallet);
touristRouter.post('/redeemPoints', auth_check, redeemPointsToWallet);
touristRouter.put('/deleteAccount', auth_check, requestAccountDeletion);
touristRouter.post('/cancelActivity/:activityId', auth_check, cancelActivity);
touristRouter.post(
	'/cancelItinerary/:itineraryId',
	auth_check,
	cancelItinerary
);

touristRouter.post(
	'/cancelAttraction/:attractionId',
	auth_check,
	cancelAttraction
);

touristRouter.post('/bookTransportation/:id', auth_check, bookTransportation);
touristRouter.get(
	'/bookedTransportations',
	auth_check,
	getBookedTransportations
);
touristRouter.post('/pay-stripe-activity', auth_check, payStripeActivity);
touristRouter.post('/pay-stripe-itinerary', auth_check, payStripeItinerary);

// Route to cancel a booking for a specific transportation ID
touristRouter.delete('/cancelBooking/:id', auth_check, cancelBooking);

// Route to add a product to the wish list
touristRouter.post('/addToWishList', auth_check, addProductToWishList);

// Route to fetch the wishList of a certain Tourist
touristRouter.get('/getWishList', auth_check, getTouristWishList);

// Route to delete a product from the WishList
touristRouter.delete(
	'/removeFromWishList/:productId',
	auth_check,
	removeProductFromWishList
);

// Route to add a product to the cart
touristRouter.post('/addToCart/:productId', auth_check, addProductToCart);

// Route to fetch the cart of a certain Tourist
touristRouter.get('/getCart', auth_check, getTouristCart);
touristRouter.put(
	'/cart/update/:productId',
	auth_check,
	updateCartItemQuantity
);
touristRouter.delete('/cart/remove/:productId', auth_check, removeCartItem);
touristRouter.post('/buyProductCard', auth_check, buyProductsCard);
touristRouter.post('/buyProductCardVisa', auth_check, buyProductsCardVisa);
touristRouter.get('/orders', auth_check, getPreviousPurchases);
touristRouter.delete('/cancel-orders/:id', auth_check, cancelOrder);

// Route to bookmark an activity / itinerary / attraction
touristRouter.post('/bookMarkActivity', auth_check, bookmarkActivity);
touristRouter.post('/bookMarkItinerary', auth_check, bookmarkItinerary);
touristRouter.post('/bookMarkAttraction', auth_check, bookmarkAttraction);

// Route to fetch the bookmarks
touristRouter.get('/bookmarks', auth_check, getBookmarks);
touristRouter.delete('/bookmarks/:type/:id', auth_check, removeBookmark);
touristRouter.get(
	'/activity-notification',
	auth_check,
	getTouristActivityNotifications
);
touristRouter.get(
	'/itinerary-notification',
	auth_check,
	getTouristItineraryNotifications
);

// Route to get promo codes for a specific tourist by ID
touristRouter.get('/promoCodes', auth_check, getPromoCodesForTourist);

module.exports = touristRouter;
