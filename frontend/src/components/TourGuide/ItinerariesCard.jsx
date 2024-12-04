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
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-8 flex items-center justify-center'>
			<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
				{itineraries.length > 0 ? (
					itineraries.map((itinerary) => (
						<div
							key={itinerary._id}
							className='border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300'>
							<div className='flex flex-col h-full space-y-4 text-left'>
								<h2 className='text-xl font-semibold text-blue-900'>
									Itinerary
								</h2>

								<ul className='space-y-4'>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>
											Itinerary Name:{' '}
										</span>
										{itinerary.name || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>
											Tour Guide Name:{' '}
										</span>
										{itinerary.tourGuideId?.username || 'Unknown'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>Activities: </span>
										{itinerary.activities.join(', ') || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>Locations: </span>
										{itinerary.locations.join(', ') || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>Timeline: </span>
										{itinerary.timeline || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>Duration: </span>
										{itinerary.duration || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>Language: </span>
										{itinerary.language || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>Price: </span>
										{itinerary.price
											? (itinerary.price * conversionRate).toFixed(2)
											: 'N/A'}{' '}
										{currency}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>Rating: </span>
										<StarRating rating={itinerary.rating || 0} />
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>
											Accessibility:{' '}
										</span>
										{itinerary.accessibility || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>
											PickUp Location:{' '}
										</span>
										{itinerary.pickupLocation || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>
											DropOff Locations:{' '}
										</span>
										{itinerary.dropoffLocation || 'N/A'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>
											Booking Status:{' '}
										</span>
										{itinerary.bookingOpen ? 'Open' : 'Closed'}
									</li>
									<li className='text-gray-800'>
										<span className='font-semibold text-lg'>
											Available Dates:{' '}
										</span>
										{itinerary.availableDates.join(', ') || 'N/A'}
									</li>
								</ul>

								<button
									onClick={() => handleBookItinerary(itinerary)}
									className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-green-700'>
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
									className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
									Pay via Stripe
								</button>
								<div className='relative'>
									<div className='flex justify-between'>
										<button
											onClick={toggleShareOptions}
											className='bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 mt-2'>
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
		</div>
	);
};

export default ItinerariesCard;
