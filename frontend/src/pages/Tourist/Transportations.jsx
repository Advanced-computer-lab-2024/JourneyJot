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
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Available Transportation</h1>
			{error && <p className='text-red-500'>{error}</p>}

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{transportationList.map((transportation) => (
					<div
						key={transportation._id}
						className='bg-white p-4 rounded-lg shadow-md'>
						<h2 className='text-xl font-semibold'>
							{transportation.vehicleType}
						</h2>
						<p>
							<strong>Location:</strong> {transportation.location}
						</p>
						<p>
							<strong>Available Seats:</strong> {transportation.availableSeats}
						</p>
						<p>
							<strong>Price per Seat:</strong> ${transportation.pricePerSeat}
						</p>
						<label>
							Select Seats:
							<select
								value={selectedSeats[transportation._id] || 1}
								onChange={(e) =>
									handleSeatSelection(
										transportation._id,
										parseInt(e.target.value)
									)
								}
								className='ml-2 p-1 rounded border'>
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
						</label>
						<button
							className='bg-blue-600 text-white px-4 py-2 rounded mt-4'
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
				))}
			</div>

			<h1 className='text-2xl font-bold mt-8 mb-4'>
				My Booked Transportations
			</h1>

			{bookedTransportations.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{bookedTransportations.map((booking) => (
						<div
							key={booking._id}
							className='bg-white p-4 rounded-lg shadow-md'>
							<h2 className='text-xl font-semibold'>{booking.vehicleType}</h2>
							<p>
								<strong>Location:</strong> {booking.location}
							</p>
							<p>
								<strong>Booked Seats:</strong> {booking.bookedSeats}
							</p>
							<p>
								<strong>Price per Seat:</strong> ${booking.pricePerSeat}
							</p>
							<button
								className='bg-red-600 text-white px-4 py-2 rounded mt-4'
								onClick={() => handleCancelBooking(booking._id)}>
								Cancel Booking
							</button>
						</div>
					))}
				</div>
			) : (
				<p>No bookings found.</p>
			)}
		</div>
	);
};

export default Transportation;
