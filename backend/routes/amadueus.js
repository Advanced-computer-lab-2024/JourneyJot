/** @format */

const express = require('express');
const amadeusRoutes = express.Router();
const amadeus = require('../models/amadeusClient');
const axios = require('axios');

const RAPIDAPI_HOST = 'travel-advisor.p.rapidapi.com';
const RAPIDAPI_KEY = '37f7f06eb1msh27743fb8d0f59d3p140383jsnfc69126288de';
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
amadeusRoutes.get('/locations', async (req, res) => {
	const {
		query = 'cairo', // Default query
		limit = 10,
		offset = 0,
		units = 'km',
		location_id = 1,
		currency = 'USD',
		sort = 'relevance',
		lang = 'en_US',
	} = req.query;

	try {
		const response = await axios.get(
			`https://${RAPIDAPI_HOST}/locations/search`,
			{
				params: {
					query,
					limit,
					offset,
					units,
					location_id,
					currency,
					sort,
					lang,
				},
				headers: {
					'x-rapidapi-host': RAPIDAPI_HOST,
					'x-rapidapi-key': RAPIDAPI_KEY,
				},
			}
		);

		if (!response.data || !response.data.data) {
			return res
				.status(404)
				.json({ error: 'No locations found for the given query.' });
		}

		res.status(200).json(response.data);
	} catch (error) {
		console.error(
			'Error fetching locations:',
			error.response?.data || error.message
		);
		res
			.status(500)
			.json({ error: 'Failed to fetch locations.', details: error.message });
	}
});

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

		res.status(200).json(response.data);
	} catch (error) {
		console.error(
			'Error fetching hotels:',
			error.response?.data || error.message
		);
		res
			.status(500)
			.json({ error: 'Failed to fetch hotels.', details: error.message });
	}
});

// Hotel Search

amadeusRoutes.get('/hotels', async (req, res) => {
	const {
		location_id = '293919', // Default location_id
		adults = 1,
		rooms = 1,
		nights = 2,
		offset = 0,
		currency = 'USD',
		order = 'asc',
		limit = 10,
		sort = 'recommended',
		lang = 'en_US',
	} = req.query;

	try {
		const response = await axios.get(`https://${RAPIDAPI_HOST}/hotels/list`, {
			params: {
				location_id,
				adults,
				rooms,
				nights,
				offset,
				currency,
				order,
				limit,
				sort,
				lang,
			},
			headers: {
				'x-rapidapi-host': RAPIDAPI_HOST,
				'x-rapidapi-key': RAPIDAPI_KEY,
			},
		});

		if (!response.data || !response.data.data) {
			return res
				.status(404)
				.json({ error: 'No hotels found for the given criteria.' });
		}

		res.status(200).json(response.data);
	} catch (error) {
		console.error(
			'Error fetching hotels:',
			error.response?.data || error.message
		);
		res
			.status(500)
			.json({ error: 'Failed to fetch hotels.', details: error.message });
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
module.exports = amadeusRoutes;
