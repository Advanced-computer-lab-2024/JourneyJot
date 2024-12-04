/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import airportsData from '../../data/airports.json';
import Select from 'react-select';
import FlightOffers from './FlightOffers';
import FlightBookingModal from './FlightBookingModal';
import { useNavigate } from 'react-router-dom';

const FlightSearch = () => {
	const [departure, setDeparture] = useState(null);
	const [destination, setDestination] = useState(null);
	const [departureDate, setDepartureDate] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [flightOffers, setFlightOffers] = useState([]);
	const [selectedFlight, setSelectedFlight] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const navigate = useNavigate();

	const airportOptions = airportsData
		.filter((airport) => airport.iata && airport.name)
		.map((airport) => ({
			value: airport.iata,
			label: `${airport.name} (${airport.iata})`,
		}));

	useEffect(() => {
		if (departure || destination || departureDate) {
			setError('');
		}
	}, [departure, destination, departureDate]);

	const handleSearchFlights = async () => {
		if (!departure || !destination || !departureDate) {
			setError('Please fill in all fields.');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const { data } = await axios.get(
				'http://localhost:3000/amadeus/flights',
				{
					params: {
						origin: departure.value,
						destination: destination.value,
						departureDate,
					},
				}
			);
			setFlightOffers(data);
		} catch (err) {
			console.error('Error fetching flight offers:', err.message);
			setError('Failed to fetch flight offers.');
		} finally {
			setLoading(false);
		}
	};

	const handleBookFlight = (flight) => {
		const flightData = {
			flightId: flight.id,
			origin: flight.itineraries[0]?.segments[0]?.departure?.iataCode || 'N/A',
			destination:
				flight.itineraries[0]?.segments[0]?.arrival?.iataCode || 'N/A',
			departureDate:
				flight.itineraries[0]?.segments[0]?.departure?.at.split('T')[0],
			price: {
				currency: flight.price?.currency || '',
				total: flight.price?.total || 'N/A',
				base: flight.price?.base || 'N/A',
			},
			seatsAvailable: flight.numberOfBookableSeats || 0,
			airline: flight.validatingAirlineCodes || [],
			passenger: {},
		};

		setSelectedFlight(flightData);
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setSelectedFlight(null);
	};

	const handleModalSubmit = async (passengerData) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				alert('User is not authenticated.');
				return;
			}

			const bookingData = { ...selectedFlight, passenger: passengerData };

			const { data } = await axios.post(
				'http://localhost:3000/flights/book',
				bookingData,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const { wallet, points } = data;

			alert(
				`Flight booked successfully! Wallet Balance: $${wallet}, Points: ${points}`
			);
			handleModalClose();
		} catch (err) {
			console.error('Error booking flight:', err.message);
			alert('Failed to book the flight.');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6'>
			<div className='container mx-auto p-6 bg-gray-50 shadow-md rounded-lg'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6'>
					Search and Book Flights ✈️
				</h1>
				{error && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
						{error}
					</div>
				)}

				<div className='flex justify-end mb-6'>
					<button
						onClick={() => navigate('/booked-flights')}
						className='bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow-md'>
						My Bookings
					</button>
				</div>

				<div className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Departure Airport:
						</label>
						<Select
							options={airportOptions}
							value={departure}
							onChange={setDeparture}
							placeholder='Select Departure Airport'
							className='rounded-md'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Destination Airport:
						</label>
						<Select
							options={airportOptions}
							value={destination}
							onChange={setDestination}
							placeholder='Select Destination Airport'
							className='rounded-md'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Departure Date:
						</label>
						<input
							type='date'
							value={departureDate}
							onChange={(e) => setDepartureDate(e.target.value)}
							className='block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200'
						/>
					</div>
				</div>

				<div className='mt-6'>
					<button
						onClick={handleSearchFlights}
						className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-md transition ${
							loading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						disabled={loading}>
						{loading ? 'Searching...' : 'Search Flights'}
					</button>
				</div>

				<FlightOffers
					flightOffers={flightOffers}
					onBook={handleBookFlight}
				/>

				{selectedFlight && (
					<FlightBookingModal
						open={isModalOpen}
						onClose={handleModalClose}
						onSubmit={handleModalSubmit}
					/>
				)}
			</div>
		</div>
	);
};

export default FlightSearch;
