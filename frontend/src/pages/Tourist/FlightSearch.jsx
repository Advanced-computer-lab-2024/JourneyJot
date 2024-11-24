/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import airportsData from '../../data/airports.json';
import Select from 'react-select';
import FlightOffers from './FlightOffers';
import FlightBookingModal from './FlightBookingModal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const FlightSearch = () => {
	const [departure, setDeparture] = useState(null);
	const [destination, setDestination] = useState(null);
	const [departureDate, setDepartureDate] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [flightOffers, setFlightOffers] = useState([]);
	const [selectedFlight, setSelectedFlight] = useState(null); // Selected flight for booking
	const [isModalOpen, setModalOpen] = useState(false); // Modal open state
	const navigate = useNavigate(); // Initialize navigate hook

	// Convert JSON data to the format suitable for react-select
	const airportOptions = airportsData
		.filter((airport) => airport.iata && airport.name) // Filter out invalid data
		.map((airport) => ({
			value: airport.iata,
			label: `${airport.name} (${airport.iata})`,
		}));

	// useEffect to clear error when state changes
	useEffect(() => {
		if (departure || destination || departureDate) {
			setError(null); // Clear errors when inputs change
		}
	}, [departure, destination, departureDate]);

	// Function to handle flight search
	const handleSearchFlights = async () => {
		if (!departure || !destination || !departureDate) {
			setError('Please fill in all fields.');
			return;
		}

		setLoading(true);

		try {
			const response = await axios.get(
				'http://localhost:3000/amadeus/flights',
				{
					params: {
						origin: departure.value,
						destination: destination.value,
						departureDate: departureDate,
					},
				}
			);
			console.log(response.data);
			setFlightOffers(response.data);
			setError(null);
		} catch (err) {
			console.error('Error fetching flight offers:', err.message);
			setError('Failed to fetch flight offers.');
		} finally {
			setLoading(false);
		}
	};

	// Function to handle flight booking
	const handleBookFlight = (flight) => {
		setSelectedFlight({
			flightId: flight.id,
			origin: flight.itineraries[0]?.segments[0]?.departure?.iataCode,
			destination: flight.itineraries[0]?.segments[0]?.arrival?.iataCode,
			departureDate:
				flight.itineraries[0]?.segments[0]?.departure?.at.split('T')[0],
			price: {
				currency: flight.price?.currency,
				total: flight.price?.total,
				base: flight.price?.base,
			},
			seatsAvailable: flight.numberOfBookableSeats,
			airline: flight.validatingAirlineCodes,
			passenger: {}, // Placeholder for passenger details to be added later
		});
		setModalOpen(true); // Open the booking modal
	};

	// Function to handle modal close
	const handleModalClose = () => {
		setModalOpen(false); // Close the modal
		setSelectedFlight(null); // Clear selected flight
	};

	// Navigate to Booked Flights page
	const handleNavigateToBookings = () => {
		navigate('/booked-flights'); // Navigate to the Booked Flights page
	};

	// Function to handle modal submit
	const handleModalSubmit = async (passengerData) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				alert('User is not authenticated.');
				return;
			}

			const bookingData = {
				...selectedFlight,
				passenger: passengerData,
			};

			const response = await axios.post(
				'http://localhost:3000/flights/book',
				bookingData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const { wallet, points } = response.data;

			alert(
				`Flight booked successfully! Updated Wallet Balance: $${wallet}, Total Points: ${points}`
			);

			setModalOpen(false); // Close modal on successful booking
		} catch (error) {
			console.error('Error booking flight:', error.message);
			alert('Failed to book the flight.');
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Flight Search</h1>
			{error && <p className='text-red-500'>{error}</p>}
			{/* Navigate to Booked Flights */}
			<button
				onClick={handleNavigateToBookings}
				className='bg-blue-600 text-white px-4 py-2 rounded mb-6'>
				My Bookings
			</button>
			{/* Search Fields */}
			<div className='mb-4'>
				<label className='block mb-2'>Select Departure Airport:</label>
				<Select
					options={airportOptions}
					value={departure}
					onChange={setDeparture}
					placeholder='Search Departure Airport'
				/>
			</div>

			<div className='mb-4'>
				<label className='block mb-2'>Select Destination Airport:</label>
				<Select
					options={airportOptions}
					value={destination}
					onChange={setDestination}
					placeholder='Search Destination Airport'
				/>
			</div>

			<div className='mb-4'>
				<label className='block mb-2'>Select Departure Date:</label>
				<input
					type='date'
					value={departureDate}
					onChange={(e) => setDepartureDate(e.target.value)}
					className='border p-2 rounded w-full'
				/>
			</div>

			<button
				onClick={handleSearchFlights}
				className='bg-blue-600 text-white px-4 py-2 rounded mb-6'
				disabled={loading}>
				{loading ? 'Searching...' : 'Search Flights'}
			</button>

			{/* Display Flight Offers */}
			<FlightOffers
				flightOffers={flightOffers}
				onBook={handleBookFlight}
			/>

			{/* Booking Modal */}
			{selectedFlight && (
				<FlightBookingModal
					open={isModalOpen}
					onClose={handleModalClose}
					onSubmit={handleModalSubmit}
				/>
			)}
		</div>
	);
};

export default FlightSearch;
