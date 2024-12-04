/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookedHotels = () => {
	const [bookedHotels, setBookedHotels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [hotelDetails, setHotelDetails] = useState(null); // State to store fetched hotel details

	const token = localStorage.getItem('token'); // Retrieve token from local storage

	useEffect(() => {
		// Fetch booked hotels when component mounts
		const fetchBookedHotels = async () => {
			try {
				const response = await axios.get('http://localhost:3000/hotels', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setBookedHotels(response.data); // Set the booked hotels to state
			} catch (err) {
				console.error('Error fetching booked hotels:', err.message);
				setError('Failed to fetch booked hotels.');
			} finally {
				setLoading(false); // Set loading state to false after the request completes
			}
		};

		fetchBookedHotels();
	}, [token]);

	// Fetch hotel details by hotel ID
	const fetchHotelDetails = async (hotelId) => {
		try {
			const response = await axios.get(
				`http://localhost:3000/hotels/${hotelId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response.data); // Log the hotel details
			setHotelDetails(response.data); // Store hotel details in state
		} catch (error) {
			console.error('Error fetching hotel details:', error);
		}
	};

	// Handle hotel cancellation
	const handleCancelHotel = async (hotelId) => {
		if (window.confirm('Are you sure you want to cancel this booking?')) {
			try {
				const response = await axios.delete(
					`http://localhost:3000/hotels/${hotelId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				alert(response.data.message || 'Hotel booking canceled successfully!');
				setBookedHotels((prevHotels) =>
					prevHotels.filter((hotel) => hotel._id !== hotelId)
				);
			} catch (err) {
				console.error('Error canceling hotel booking:', err.message);
				alert('Failed to cancel the booking.');
			}
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6'>
			<h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
				Booked Hotels
			</h1>

			{loading && <p className='text-center text-blue-500'>Loading...</p>}
			{error && <p className='text-center text-red-500'>{error}</p>}

			{bookedHotels.length === 0 && !loading && (
				<p className='text-center text-gray-600'>No booked hotels found.</p>
			)}

			{bookedHotels.length > 0 && (
				<ul className='space-y-4'>
					{bookedHotels.map((hotel) => (
						<li
							key={hotel._id}
							className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
							<h3 className='text-xl font-semibold text-gray-800 mb-2'>
								<button
									onClick={() => fetchHotelDetails(hotel._id)}
									className='text-blue-600 hover:underline'>
									{hotel.hotelName || 'Hotel Name Not Available'}
								</button>
							</h3>
							<p className='text-sm text-gray-600 mb-2'>
								{hotel.location || 'Location Not Available'}
							</p>
							<button
								onClick={() => handleCancelHotel(hotel._id)}
								className='bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200'>
								Cancel Booking
							</button>
						</li>
					))}
				</ul>
			)}

			{/* Display hotel details if available */}
			{hotelDetails && (
				<div className='mt-8 p-6 bg-white rounded-lg shadow-lg'>
					<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
						Hotel Details
					</h2>
					<p className='text-lg'>
						<strong>Name:</strong> {hotelDetails.hotelName}
					</p>
					<p className='text-lg'>
						<strong>Location:</strong> {hotelDetails.location}
					</p>
					<p className='text-lg'>
						<strong>Check-in Date:</strong> {hotelDetails.checkInDate}
					</p>
					<p className='text-lg'>
						<strong>Check-out Date:</strong> {hotelDetails.checkOutDate}
					</p>
					<p className='text-lg'>
						<strong>Price:</strong> {hotelDetails.price.total}{' '}
						{hotelDetails.price.currency}
					</p>
					<p className='text-lg'>
						<strong>Rooms Available:</strong> {hotelDetails.roomsAvailable}
					</p>
				</div>
			)}
		</div>
	);
};

export default BookedHotels;
