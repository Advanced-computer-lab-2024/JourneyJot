/** @format */

const express = require('express');
const {
	createItinerary,
	getItineraries,
	updateItinerary,
	deleteItinerary,
	getItinerary,
	sortByPriceOrRating,
	filterItineraries,
} = require('../controllers/itinerary');
const authenticate = require('../middleware/auth-check'); // Assuming you have an auth middleware
const roleCheck = require('../middleware/tour-guide-check'); // Check if user is a tour guide
const itineraryRouter = express.Router();

itineraryRouter.post('/', authenticate, roleCheck, createItinerary); // Create itinerary
itineraryRouter.get('/', getItineraries); // Get all itineraries for the tour guide
itineraryRouter.put('/:id', authenticate, roleCheck, updateItinerary); // Update itinerary
itineraryRouter.delete('/:id', authenticate, roleCheck, deleteItinerary); // Delete itinerary
itineraryRouter.get('/sort', sortByPriceOrRating);
itineraryRouter.get('/filter', filterItineraries); // filter activities based on price, preference etc...
itineraryRouter.get('/:id', getItinerary); //get one iterator by id

module.exports = itineraryRouter;
