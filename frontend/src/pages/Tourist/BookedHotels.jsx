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
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400  p-6'>
			<h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>
				Booked Hotels
			</h1>

			{loading && (
				<p className='text-center text-blue-500 text-lg'>Loading...</p>
			)}
			{error && <p className='text-center text-red-500 text-lg'>{error}</p>}

			{bookedHotels.length === 0 && !loading && (
				<p className='text-center text-gray-500 text-lg'>
					No booked hotels found.
				</p>
			)}

			{bookedHotels.length > 0 && (
				<ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{bookedHotels.map((hotel) => (
						<li
							key={hotel._id}
							className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6'>
							<h3 className='text-xl font-bold text-gray-800 mb-2 truncate'>
								<button
									onClick={() => fetchHotelDetails(hotel._id)}
									className='text-indigo-600 hover:underline'>
									{hotel.hotelName || 'Hotel Name Not Available'}
								</button>
							</h3>
							<p className='text-gray-600 text-sm mb-4'>
								{hotel.location || 'Location Not Available'}
							</p>
							<button
								onClick={() => handleCancelHotel(hotel._id)}
								className='w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition duration-200'>
								Cancel Booking
							</button>
						</li>
					))}
				</ul>
			)}

			{/* Display hotel details if available */}
			{hotelDetails && (
				<div className='mt-8 p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto'>
					<h2 className='text-2xl font-bold text-gray-800 mb-4'>
						Hotel Details
					</h2>
					<div className='space-y-2 text-lg'>
						<p>
							<strong className='text-gray-700'>Name:</strong>{' '}
							{hotelDetails.hotelName}
						</p>
						<p>
							<strong className='text-gray-700'>Location:</strong>{' '}
							{hotelDetails.location}
						</p>
						<p>
							<strong className='text-gray-700'>Check-in Date:</strong>{' '}
							{hotelDetails.checkInDate}
						</p>
						<p>
							<strong className='text-gray-700'>Check-out Date:</strong>{' '}
							{hotelDetails.checkOutDate}
						</p>
						<p>
							<strong className='text-gray-700'>Price:</strong>{' '}
							{hotelDetails.price.total} {hotelDetails.price.currency}
						</p>
						<p>
							<strong className='text-gray-700'>Rooms Available:</strong>{' '}
							{hotelDetails.roomsAvailable}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default BookedHotels;
