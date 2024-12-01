/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookedFlights = () => {
	const [bookedFlights, setBookedFlights] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Retrieve the logged-in user's token (assumed stored in localStorage)
	const token = localStorage.getItem('token');

	useEffect(() => {
		const fetchBookedFlights = async () => {
			try {
				const response = await axios.get(`http://localhost:3000/flights`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setBookedFlights(response.data);
			} catch (err) {
				console.error('Error fetching booked flights:', err.message);
				setError('Failed to fetch booked flights. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchBookedFlights();
	}, [token]);

	const handleCancelFlight = async (flightId) => {
		if (!window.confirm('Are you sure you want to cancel this flight?')) {
			return;
		}

		try {
			const response = await axios.delete(
				`http://localhost:3000/flights/${flightId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			alert(response.data.message || 'Flight booking canceled successfully!');
			// Remove the canceled flight from the list
			setBookedFlights((prevFlights) =>
				prevFlights.filter((flight) => flight._id !== flightId)
			);
		} catch (err) {
			console.error('Error canceling flight booking:', err.message);
			alert('Failed to cancel the flight booking.');
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Booked Flights</h1>

			{loading && <p>Loading...</p>}
			{error && <p className='text-red-500'>{error}</p>}

			{bookedFlights.length === 0 && !loading && (
				<p className='text-gray-500'>No booked flights found.</p>
			)}

			{bookedFlights.length > 0 && (
				<div className='mt-4'>
					<ul>
						{bookedFlights.map((flight, index) => (
							<li
								key={flight._id}
								className='mb-4 p-4 border rounded shadow'>
								<h2 className='text-xl font-bold mb-2'>Passenger Details</h2>
								<p>
									<strong>First Name:</strong> {flight.passenger?.firstName}
								</p>
								<p>
									<strong>Last Name:</strong> {flight.passenger?.lastName}
								</p>
								<p>
									<strong>Date of Birth:</strong>{' '}
									{flight.passenger?.dateOfBirth}
								</p>
								<p>
									<strong>Email:</strong> {flight.passenger?.emailAddress}
								</p>
								<p>
									<strong>Phone:</strong> {flight.passenger?.phone}
								</p>
								<p>
									<strong>Document Number:</strong>{' '}
									{flight.passenger?.documentNumber}
								</p>

								<h2 className='text-xl font-bold mt-4 mb-2'>Flight Details</h2>
								<p>
									<strong>Flight ID:</strong> {flight.flightId}
								</p>
								<p>
									<strong>Origin:</strong> {flight.origin}
								</p>
								<p>
									<strong>Destination:</strong> {flight.destination}
								</p>
								<p>
									<strong>Departure Date:</strong> {flight.departureDate}
								</p>
								<p>
									<strong>Total Price:</strong> {flight.price.total}{' '}
									{flight.price.currency}
								</p>
								<p>
									<strong>Seats Available:</strong> {flight.seatsAvailable}
								</p>
								<p>
									<strong>Airline:</strong> {flight.airline?.join(', ')}
								</p>

								<button
									onClick={() => handleCancelFlight(flight._id)}
									className='bg-red-500 text-white px-4 py-2 mt-4 rounded'>
									Cancel Booking
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default BookedFlights;
