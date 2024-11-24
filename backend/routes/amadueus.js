/** @format */

const express = require('express');
const amadeusRoutes = express.Router();
const amadeus = require('../models/amadeusClient');

// Fetch Airports

const generateCombinations = (length) => {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	let combinations = [];

	const combine = (prefix, depth) => {
		if (depth === 0) {
			combinations.push(prefix);
			return;
		}
		for (let i = 0; i < alphabet.length; i++) {
			combine(prefix + alphabet[i], depth - 1);
		}
	};

	combine('', length);
	return combinations;
};

amadeusRoutes.get('/airports', async (req, res) => {
	try {
		const allAirports = [];
		const maxCombinationLength = 2; // Keyword length (e.g., "a", "aa", etc.)
		const keywordCombinations = generateCombinations(maxCombinationLength); // Generate all keywords
		const limit = 100; // Amadeus API limit per request

		// Fetch airports for each keyword
		for (const keyword of keywordCombinations) {
			try {
				let offset = 0;

				while (true) {
					const response = await amadeus.referenceData.locations.get({
						subType: 'AIRPORT',
						keyword,
						limit,
						offset,
					});

					if (response.result?.data?.length) {
						allAirports.push(...response.result.data);
						if (response.result.data.length < limit) break; // End if no more data
						offset += limit;
					} else {
						break; // End if no data
					}
				}
			} catch (error) {
				console.error(
					`Error fetching airports for keyword "${keyword}":`,
					error.message
				);
			}
		}

		// Remove duplicates based on IATA codes
		const uniqueAirports = Array.from(
			new Map(
				allAirports.map((airport) => [airport.iataCode, airport])
			).values()
		);

		res.status(200).json(uniqueAirports);
	} catch (error) {
		console.error('Error fetching airports:', error.message);
		res.status(500).json({ error: 'Failed to fetch airports.' });
	}
});

// Hotel Search
amadeusRoutes.get('/hotels', async (req, res) => {
	const { cityCode, hotelName, checkInDate, checkOutDate } = req.query;

	try {
		// Build parameters for Amadeus API request
		const params = {
			cityCode, // IATA code of the city
			checkInDate,
			checkOutDate,
			currency: 'USD', // Optional: Default currency set to USD
		};

		// Include hotel name as a keyword filter if provided
		if (hotelName) params.keyword = hotelName;

		// Call Amadeus API for hotel offers
		const response = await amadeus.shopping.hotelOffers.get(params);

		// Log response for debugging purposes
		console.log('Amadeus Hotel API Response:', response.data);

		// Return results to the client
		res.status(200).json(response.result?.data || []);
	} catch (error) {
		console.error('Error fetching hotel data from Amadeus:', error.message);

		// Check for specific error details and respond accordingly
		if (error.response?.status) {
			res.status(error.response.status).json({
				error: error.response.data,
			});
		} else {
			// Return a generic 500 error if no specific error is found
			res.status(500).json({ error: 'Failed to fetch hotel data.' });
		}
	}
});
// Flight Offers Search
amadeusRoutes.get('/flights', async (req, res) => {
	const { origin, destination, departureDate } = req.query;

	try {
		const response = await amadeus.shopping.flightOffersSearch.get({
			originLocationCode: origin,
			destinationLocationCode: destination,
			departureDate,
			adults: 1,
		});

		console.log('Amadeus API Response:', response.data); // Log successful response
		res.status(200).json(response.data);
	} catch (error) {
		console.error('Backend Error:', {
			message: error.message,
			response: error.response?.data, // Detailed error response from Amadeus API
		});
		res.status(500).json({ error: 'Failed to fetch flight offers.' });
	}
});

// Flight Booking
amadeusRoutes.post('/bookFlight', async (req, res) => {
	const { flightId } = req.body;

	try {
		const response = await amadeus.booking.flightOrders.post(
			JSON.stringify({
				data: {
					type: 'flight-order',
					flightOffers: [{ id: flightId }],
					travelers: [
						{
							id: '1',
							dateOfBirth: '1990-01-01',
							name: { firstName: 'John', lastName: 'Doe' },
							contact: {
								emailAddress: 'john.doe@example.com',
								phones: [
									{
										deviceType: 'MOBILE',
										countryCallingCode: '1',
										number: '123456789',
									},
								],
							},
							documents: [
								{
									documentType: 'PASSPORT',
									birthPlace: 'CITY',
									issuanceLocation: 'COUNTRY',
									issuanceDate: '2015-04-14',
									number: '000000000',
									expiryDate: '2025-04-14',
									issuanceCountry: 'COUNTRY',
									nationality: 'COUNTRY',
									holder: true,
								},
							],
						},
					],
				},
			})
		);

		res.status(200).json({
			message: 'Flight booked successfully',
			bookingDetails: response.result,
		});
	} catch (error) {
		console.error('Error booking flight:', error);
		res.status(500).json({ error: 'Failed to book flight' });
	}
});

module.exports = amadeusRoutes;
