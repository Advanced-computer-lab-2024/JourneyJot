/** @format */

const express = require('express');
const itineraryRouter = express.Router();
const {
	addItinerary,
	getItineraries,
	updatedItinerary,
	deleteItinerary,
} = require('../controllers/tourist-itinerary');
const tourGuideCheck = require('../middleware/tour-guide-check');
const authCheck = require('../middleware/auth-check');

itineraryRouter.post('/', authCheck, tourGuideCheck, addItinerary);
itineraryRouter.get('/', authCheck, tourGuideCheck, getItineraries);
itineraryRouter.put('/:id', authCheck, tourGuideCheck, updatedItinerary);
itineraryRouter.delete('/:id', authCheck, tourGuideCheck, deleteItinerary);

module.exports = itineraryRouter;
