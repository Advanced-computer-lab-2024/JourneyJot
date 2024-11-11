/** @format */

import React, { useState } from 'react';
import axios from 'axios';
import StarRating from '../Helper/StarRating';

const ItinerariesCard = ({ itineraries = [], currency, conversionRate }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItinerary, setSelectedItinerary] = useState(null);
	const [error, setError] = useState(null); // State to handle errors
	const [shareOptionsVisible, setShareOptionsVisible] = useState(false); // Toggle for share options

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
			`Here is a link to the activity: http://localhost:5173/itineraries/${itinerary._id}`
		);
		window.location.href = `mailto:?subject=${subject}&body=${body}`;
	};

	const toggleShareOptions = () => {
		setShareOptionsVisible(!shareOptionsVisible);
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
							<div className='relative'>
								<button
									onClick={toggleShareOptions}
									className='bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 mt-2'>
									Share
								</button>
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
	);
};

export default ItinerariesCard;
