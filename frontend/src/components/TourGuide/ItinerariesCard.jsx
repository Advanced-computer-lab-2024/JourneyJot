/** @format */

import React, { useState } from 'react';
import axios from 'axios';

// StarRating Component to display stars
const StarRating = ({ rating }) => {
	const fullStars = Math.floor(rating);
	const emptyStars = 5 - fullStars;

	return (
		<div className='flex space-x-1'>
			{[...Array(fullStars)].map((_, index) => (
				<svg
					key={`full-${index}`}
					xmlns='http://www.w3.org/2000/svg'
					className='w-5 h-5 text-yellow-500'
					fill='currentColor'
					viewBox='0 0 20 20'>
					<path d='M10 15.27l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L10 3 7.19 8.82 2 9.24l3.46 3.67-1.64 5.09L10 15.27z' />
				</svg>
			))}
			{[...Array(emptyStars)].map((_, index) => (
				<svg
					key={`empty-${index}`}
					xmlns='http://www.w3.org/2000/svg'
					className='w-5 h-5 text-gray-300'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						fill='none'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M12 17.75l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L12 3l-2.81 5.82-5.19.42L7.46 15.42 3 18.15 12 17.75z'
					/>
				</svg>
			))}
		</div>
	);
};

const ItinerariesCard = ({ itineraries = [], currency, conversionRate }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItinerary, setSelectedItinerary] = useState(null);
	const [error, setError] = useState(null); // State to handle errors

	const handleBookItinerary = (itinerary) => {
		setSelectedItinerary(itinerary);
		setIsModalOpen(true);
	};

	const confirmBooking = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const response = await axios.post(
				'http://localhost:3000/tourists/bookItinerary',
				{ itineraryId: selectedItinerary._id },
				config
			);

			const { message, updatedWalletBalance, pointsEarned, totalPoints } =
				response.data;

			// Display a success message with wallet and points details
			alert(
				`${message}. You earned ${pointsEarned} points! Your total points are now ${totalPoints}. Wallet balance: $${updatedWalletBalance}.`
			);

			setIsModalOpen(false); // Close the modal after booking
		} catch (error) {
			setError(error.response?.data?.message || 'An error occurred.'); // Set the error message in state
			console.error('Error booking attraction:', error);
			setIsModalOpen(false);
		}
	};
	const handleShareItinerary = (activity) => {
		alert(`Share link for activity: ${activity.name}`);
	};

	return (
		<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
			{itineraries.length > 0 ? (
				itineraries.map((itinerary) => (
					<div
						key={itinerary._id}
						className='border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300'>
						<div className='flex flex-col h-full space-y-4 text-left'>
							<h2 className='text-xl font-semibold text-blue-900'>Itinerary</h2>
							<ul className='list-disc list-inside space-y-2 text-gray-700'>
								<li>
									<span className='font-semibold'>Tour Guide Name: </span>
									{itinerary.tourGuideId?.username || 'Unknown'}
								</li>
								<li>
									<span className='font-semibold'>Activities: </span>
									{itinerary.activities.join(', ')}
								</li>
								<li>
									<span className='font-semibold'>Locations: </span>
									{itinerary.locations.join(', ')}
								</li>
								<li>
									<span className='font-semibold'>Timeline: </span>
									{itinerary.timeline}
								</li>
								<li>
									<span className='font-semibold'>Duration: </span>
									{itinerary.duration}
								</li>
								<li>
									<span className='font-semibold'>Language: </span>
									{itinerary.language}
								</li>

								<li>
									<span className='font-semibold'>Price: </span>
									{(itinerary.price * conversionRate).toFixed(2)} {currency}
								</li>
								<li>
									<span className='font-semibold'>Rating:</span>{' '}
									<StarRating rating={itinerary.rating || 0} />
								</li>
								<li>
									<span className='font-semibold'>Accessibility: </span>
									{itinerary.accessibility}
								</li>
								<li>
									<span className='font-semibold'>PickUp Location: </span>
									{itinerary.pickupLocation}
								</li>
								<li>
									<span className='font-semibold'>DropOf Locations: </span>
									{itinerary.dropoffLocation}
								</li>
								<li>
									<span className='font-semibold'>Available Dates: </span>
									{itinerary.availableDates.join(', ')}
								</li>
							</ul>
							<button
								onClick={() => handleBookItinerary(itinerary)}
								className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-green-700'>
								Book Itinerary
							</button>
							<button
								onClick={() => handleShareItinerary(itinerary)}
								className='bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 mt-2'>
								Share
							</button>
						</div>
					</div>
				))
			) : (
				<p className='text-center text-gray-500 col-span-full'>
					No itineraries available.
				</p>
			)}
			{error && (
				<div className='fixed bottom-5 right-5 bg-red-600 text-white py-3 px-6 rounded-md shadow-lg z-50 transition-opacity duration-500 opacity-100'>
					<div className='flex items-center justify-between space-x-4'>
						<p className='font-semibold'>{error}</p>
						<button
							className='text-white font-bold'
							onClick={() => setError(null)} // Close error message when clicked
						>
							X
						</button>
					</div>
				</div>
			)}

			{isModalOpen && selectedItinerary && (
				<div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
					<div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
						<h3 className='text-lg font-semibold text-center'>
							Confirm Booking
						</h3>
						<p className='text-center my-4'>
							Price: ${(selectedItinerary.price * conversionRate).toFixed(2)}
						</p>
						<div className='flex justify-between'>
							<button
								onClick={() => setIsModalOpen(false)}
								className='bg-gray-500 text-white px-4 py-2 rounded-md'>
								Cancel
							</button>
							<button
								onClick={confirmBooking}
								className='bg-blue-600 text-white px-4 py-2 rounded-md'>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ItinerariesCard;
