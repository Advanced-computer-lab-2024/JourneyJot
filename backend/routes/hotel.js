/** @format */

const express = require('express');
const {
    listBookedHotels,
    createHotelBooking,
    getHotelDetails,
    deleteHotelBooking,
} = require('../controllers/hotels');

const hotelRouter = express.Router();

// Middleware for user authentication (replace with your own implementation)
const authCheck = require('../middleware/auth-check');

// List all booked hotels for the authenticated tourist
hotelRouter.get('/', authCheck, listBookedHotels);

// Book a new hotel
hotelRouter.post('/book', authCheck, createHotelBooking);

// Get details of a specific hotel booking
hotelRouter.get('/:hotelId', authCheck, getHotelDetails);

// Delete a hotel booking
hotelRouter.delete('/:hotelId', authCheck, deleteHotelBooking);

module.exports = hotelRouter;
