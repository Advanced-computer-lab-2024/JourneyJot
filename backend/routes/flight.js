/** @format */

const express = require('express');
const {
	listBookedFlights,
	createFlightBooking,
	getFlightDetails,
	deleteFlightBooking,
} = require('../controllers/flight');

const flightRouter = express.Router();

// Middleware for user authentication (replace with your own implementation)
const authCheck = require('../middleware/auth-check');

// List all booked flights for the authenticated tourist
flightRouter.get('/', authCheck, listBookedFlights);

// Book a new flight
flightRouter.post('/book', authCheck, createFlightBooking);

// Get details of a specific flight
flightRouter.get('/:flightId', authCheck, getFlightDetails);

// Delete a flight booking
flightRouter.delete('/:flightId', authCheck, deleteFlightBooking);

module.exports = flightRouter;
