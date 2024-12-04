/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transportation = () => {
	const [transportationList, setTransportationList] = useState([]);
	const [bookedTransportations, setBookedTransportations] = useState([]);
	const [error, setError] = useState(null);
	const [selectedSeats, setSelectedSeats] = useState({});

	// Fetch available transportation on component mount
	useEffect(() => {
		const fetchTransportation = async () => {
			try {
				const response = await axios.get(
					'http://localhost:3000/transportation'
				);
				setTransportationList(response.data);
			} catch (err) {
				setError('Failed to fetch transportation options');
				console.error('Error fetching transportation:', err);
			}
		};

		const fetchBookedTransportations = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) throw new Error('No token found. Please login again.');

				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};

				const response = await axios.get(
					'http://localhost:3000/tourists/bookedTransportations',
					config
				);
				setBookedTransportations(response.data);
			} catch (err) {
				setError('Failed to fetch booked transportations');
				console.error('Error fetching booked transportations:', err);
			}
		};

		fetchTransportation();
		fetchBookedTransportations();
	}, []);

	// Handle seat selection
	const handleSeatSelection = (id, seats) => {
		setSelectedSeats((prev) => ({ ...prev, [id]: seats }));
	};

	// Handle booking a transportation
	const handleBookTransportation = async (id, availableSeats, pricePerSeat) => {
		const seatsToBook = selectedSeats[id] || 1; // Default to 1 seat if no selection

		// Check if selected seats exceed available seats
		if (seatsToBook > availableSeats) {
			setError('Selected seats exceed available seats.');
			return;
		}

		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			const response = await axios.post(
				`http://localhost:3000/tourists/bookTransportation/${id}`,
				{ seats: seatsToBook },
				config
			);
			alert(response.data.message || 'Transportation booked successfully!');

			// Refresh booked transportations after booking
			setBookedTransportations((prev) => [
				...prev,
				{
					...response.data.transportation,
					bookedSeats: seatsToBook,
				},
			]);

			// Update the available seats in the list
			setTransportationList((prevList) =>
				prevList.map((item) =>
					item._id === id
						? { ...item, availableSeats: item.availableSeats - seatsToBook }
						: item
				)
			);
		} catch (err) {
			setError(
				err.response
					? err.response.data.message
					: 'Failed to book transportation'
			);
			console.error('Error booking transportation:', err);
		}
	};

	// Handle canceling a booking
	const handleCancelBooking = async (id) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			const response = await axios.delete(
				`http://localhost:3000/tourists/cancelBooking/${id}`,
				config
			);
			alert(response.data.message || 'Booking canceled successfully!');

			// Update booked transportations after cancellation
			setBookedTransportations((prev) =>
				prev.filter((item) => item._id !== id)
			);
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Failed to cancel booking'
			);
			console.error('Error canceling booking:', err);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center py-8'>
			<div className='container mx-auto px-4'>
				<h1 className='text-3xl font-semibold text-center text-gray-900 mb-8'>
					Available Transportation
				</h1>
				{error && <p className='text-red-600 text-center mb-4'>{error}</p>}

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
					{transportationList.map((transportation) => (
						<div
							key={transportation._id}
							className='bg-white shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl'>
							<div className='p-6'>
								<h2 className='text-xl font-semibold text-gray-800'>
									{transportation.vehicleType}
								</h2>
								<p className='mt-2 text-gray-600'>
									<strong>Location:</strong> {transportation.location}
								</p>
								<p className='text-gray-600'>
									<strong>Available Seats:</strong>{' '}
									{transportation.availableSeats}
								</p>
								<p className='text-gray-600'>
									<strong>Price per Seat:</strong> $
									{transportation.pricePerSeat}
								</p>

								<div className='mt-4'>
									<label className='block text-sm font-medium text-gray-700'>
										Select Seats
									</label>
									<select
										value={selectedSeats[transportation._id] || 1}
										onChange={(e) =>
											handleSeatSelection(
												transportation._id,
												parseInt(e.target.value)
											)
										}
										className='mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
										{[...Array(transportation.availableSeats).keys()].map(
											(_, index) => (
												<option
													key={index + 1}
													value={index + 1}>
													{index + 1}
												</option>
											)
										)}
									</select>
								</div>

								<button
									className='mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200'
									onClick={() =>
										handleBookTransportation(
											transportation._id,
											transportation.availableSeats,
											transportation.pricePerSeat
										)
									}>
									Book Now
								</button>
							</div>
						</div>
					))}
				</div>

				<h1 className='text-3xl font-semibold text-center text-gray-900 mt-16 mb-8'>
					My Booked Transportations
				</h1>

				{bookedTransportations.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
						{bookedTransportations.map((booking) => (
							<div
								key={booking._id}
								className='bg-white shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl'>
								<div className='p-6'>
									<h2 className='text-xl font-semibold text-gray-800'>
										{booking.vehicleType}
									</h2>
									<p className='mt-2 text-gray-600'>
										<strong>Location:</strong> {booking.location}
									</p>
									<p className='text-gray-600'>
										<strong>Booked Seats:</strong> {booking.bookedSeats}
									</p>
									<p className='text-gray-600'>
										<strong>Price per Seat:</strong> ${booking.pricePerSeat}
									</p>

									<button
										className='mt-4 w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200'
										onClick={() => handleCancelBooking(booking._id)}>
										Cancel Booking
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='text-center text-gray-600'>No bookings found.</p>
				)}
			</div>
		</div>
	);
};

export default Transportation;
