/** @format */

import React, { useState } from 'react';
import axios from 'axios';
import StarRating from '../Helper/StarRating';
import { useNavigate } from 'react-router-dom';
import { FiBookmark } from 'react-icons/fi';

const ItinerariesCard = ({ itineraries = [], currency, conversionRate }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItinerary, setSelectedItinerary] = useState(null);
	const [error, setError] = useState(null); // State to handle errors
	const [shareOptionsVisible, setShareOptionsVisible] = useState(false); // Toggle for share options
	const navigate = useNavigate(); // For navigation

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
	const handleCopyLink = (itinerary) => {
		const link = `http://localhost:5173/itineraries/${itinerary._id}`;
		navigator.clipboard.writeText(link);
		alert('Link copied to clipboard!');
	};

	const handleShareViaEmail = (itinerary) => {
		const subject = encodeURIComponent(`Check out this activity`);
		const body = encodeURIComponent(
			`Here is a link to the itinerary: http://localhost:5173/itineraries/${itinerary._id}`
		);
		window.location.href = `mailto:?subject=${subject}&body=${body}`;
	};

	const toggleShareOptions = () => {
		setShareOptionsVisible(!shareOptionsVisible);
	};
	const handlePayItineraryViaStripe = (itinerary) => {
		// Ensure no PointerEvent is passed to navigate
		navigate('/pay-itinerary-stripe', {
			state: {
				itinerary: itinerary, // Pass only the serializable activity data
				currency: currency,
				conversionRate: conversionRate,
			},
		});
	};

	const handleBookmark = async (itineraryId) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const response = await axios.post(
				'http://localhost:3000/tourists/bookMarkItinerary',
				{ itineraryId },
				config
			);

			alert(response.data.message || 'itinerary bookmarked successfully!');
		} catch (error) {
			console.error('Error bookmarking itinerary:', error);
			alert(
				error.response?.data?.message ||
					'Failed to bookmark itinerary. Try again later.'
			);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
				{itineraries.length > 0 ? (
					itineraries.map((itinerary) => (
						<div
							key={itinerary._id}
							className='bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105'>
							<div className='p-6'>
								<h2 className='text-2xl font-semibold text-blue-900 mb-4'>
									{itinerary.name || 'Itinerary Name'}
								</h2>

								<ul className='space-y-4'>
									<li className='text-gray-800'>
										<span className='font-semibold'>Tour Guide Name: </span>
										{itinerary.tourGuideId?.username || 'Unknown'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold'>Activities: </span>
										{itinerary.activities.join(', ') || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold'>Locations: </span>
										{itinerary.locations.join(', ') || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold'>Price: </span>
										{itinerary.price
											? (itinerary.price * conversionRate).toFixed(2)
											: 'N/A'}{' '}
										{currency}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold'>Rating: </span>
										<StarRating rating={itinerary.rating || 0} />
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold'>Booking Status: </span>
										{itinerary.bookingOpen ? 'Open' : 'Closed'}
									</li>
								</ul>

								<div className='mt-4'>
									<button
										onClick={() => handleBookItinerary(itinerary)}
										className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300'>
										Book Itinerary
									</button>
									<button
										onClick={() =>
											handlePayItineraryViaStripe(
												itinerary,
												currency,
												conversionRate
											)
										}
										className='w-full mt-3 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md transition duration-300'>
										Pay via Stripe
									</button>
								</div>
							</div>
							<div className='relative'>
								<div className='flex justify-between p-4 bg-gray-50'>
									<button
										onClick={toggleShareOptions}
										className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300'>
										Share
									</button>
									<button
										onClick={() => handleBookmark(itinerary._id)}
										className='text-blue-500 hover:text-blue-700'>
										<FiBookmark size={24} />
									</button>
								</div>
								{shareOptionsVisible && (
									<div className='absolute bg-white border rounded shadow-md p-2 mt-1'>
										<button
											onClick={() => handleCopyLink(itinerary)}
											className='text-blue-600 hover:underline block'>
											Copy Link
										</button>
										<button
											onClick={() => handleShareViaEmail(itinerary)}
											className='text-blue-600 hover:underline block'>
											Share via Email
										</button>
									</div>
								)}
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
								onClick={() => setError(null)}>
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
		</div>
	);
};

export default ItinerariesCard;
