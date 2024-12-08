/** @format */

import React, { useState } from 'react';
import axios from 'axios';
import StarRating from '../Helper/StarRating';
import { useNavigate } from 'react-router-dom';
import { FiBookmark } from 'react-icons/fi';
import { MdPayment } from 'react-icons/md';
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItinerariesCard = ({
	itineraries = [],
	currency,
	conversionRate = 1,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItinerary, setSelectedItinerary] = useState(null);
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
			toast.success(
				`${message}. You earned ${pointsEarned} points! Your total points are now ${totalPoints}. Wallet balance: $${updatedWalletBalance}.`
			);

			setIsModalOpen(false); // Close the modal after booking
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || 'An error occurred.';
			toast.error(`Booking failed: ${errorMessage}`);
			console.error('Error booking itinerary:', error);
			setIsModalOpen(false);
		}
	};

	const handleCopyLink = (itinerary) => {
		const link = `http://localhost:5173/itineraries/${itinerary._id}`;
		navigator.clipboard.writeText(link);
		toast.info('Link copied to clipboard!');
	};

	const handleShareViaEmail = (itinerary) => {
		const subject = encodeURIComponent(`Check out this itinerary`);
		const body = encodeURIComponent(
			`Here is a link to the itinerary: http://localhost:5173/itineraries/${itinerary._id}`
		);
		window.location.href = `mailto:?subject=${subject}&body=${body}`;
	};

	const handlePayItineraryViaStripe = (itinerary) => {
		navigate('/pay-itinerary-stripe', {
			state: {
				itinerary: itinerary, // Pass only the serializable itinerary data
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

			toast.success(
				response.data.message || 'Itinerary bookmarked successfully!'
			);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				'Failed to bookmark itinerary. Try again later.';
			toast.error(`Bookmark failed: ${errorMessage}`);
			console.error('Error bookmarking itinerary:', error);
		}
	};

	return (
		<div className='flex flex-wrap justify-center gap-4 p-4'>
			{/* Toast Container for Notifications */}
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
			/>

			{itineraries.length > 0 ? (
				itineraries.map((itinerary) => (
					<div
						key={itinerary._id}
						className='relative bg-white rounded-lg shadow-md overflow-hidden w-80 hover:shadow-lg transition-shadow duration-300'>
						{/* Itinerary Details */}
						<div className='p-4 space-y-2'>
							<h2 className='text-xl font-semibold text-blue-900 truncate'>
								{itinerary.name || 'Itinerary Name'}
							</h2>
							<ul className='space-y-1 text-gray-700 text-sm'>
								<li>
									<span className='font-medium'>Tour Guide:</span>{' '}
									{itinerary.tourGuideId?.username || 'Unknown'}
								</li>
								<li>
									<span className='font-medium'>Language:</span>{' '}
									{itinerary.language || 'Unknown'}
								</li>
								<li>
									<span className='font-medium'>Activities:</span>{' '}
									{itinerary.activities.length > 0
										? itinerary.activities.join(', ')
										: 'N/A'}
								</li>
								<li>
									<span className='font-medium'>Locations:</span>{' '}
									{itinerary.locations.length > 0
										? itinerary.locations.join(', ')
										: 'N/A'}
								</li>
								<li>
									<span className='font-medium'>Price:</span>{' '}
									{itinerary.price
										? (itinerary.price * conversionRate).toFixed(2)
										: 'N/A'}{' '}
									{currency}
								</li>
								<li>
									<span className='font-medium'>Date:</span>{' '}
									{itinerary.availableDates.length > 0
										? itinerary.availableDates.join(', ')
										: 'N/A'}
								</li>

								<li>
									<span className='font-medium'>Rating:</span>{' '}
									<StarRating rating={itinerary.rating || 0} />
								</li>
								<li>
									<span className='font-medium'>Booking Status:</span>{' '}
									{itinerary.bookingOpen ? (
										<span className='text-green-500'>Open</span>
									) : (
										<span className='text-red-500'>Closed</span>
									)}
								</li>
							</ul>

							{/* Action Buttons */}
							<div className='mt-4 flex flex-col space-y-2'>
								{/* Book Itinerary Button */}
								<button
									onClick={() => handleBookItinerary(itinerary)}
									className='flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200'>
									Book Itinerary
								</button>

								{/* Pay via Stripe Button */}
								<button
									onClick={() => handlePayItineraryViaStripe(itinerary)}
									className='flex items-center justify-center bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-500 transition-colors duration-200'>
									<MdPayment className='mr-2' /> Pay via Stripe
								</button>
							</div>
						</div>

						{/* Share and Bookmark Icons */}
						<div className='flex justify-between items-center p-4 bg-gray-50'>
							{/* Share Options are always visible */}
							<div className='relative'>
								<div className='mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10'>
									<button
										onClick={() => handleCopyLink(itinerary)}
										className='flex items-center w-full text-left px-2 py-1 hover:bg-gray-100 rounded'>
										Copy Link
									</button>
									<button
										onClick={() => handleShareViaEmail(itinerary)}
										className='flex items-center w-full text-left px-2 py-1 hover:bg-gray-100 rounded'>
										Share via Email
									</button>
									{/* Social Media Share Icons */}
									<div className='flex justify-around mt-2'>
										<a
											href={`https://facebook.com/sharer/sharer.php?u=http://localhost:5173/itineraries/${itinerary._id}`}
											target='_blank'
											rel='noopener noreferrer'
											className='text-blue-600 hover:text-blue-800'
											aria-label='Share on Facebook'>
											<FaFacebookF size={18} />
										</a>
										<a
											href={`https://twitter.com/intent/tweet?url=http://localhost:5173/itineraries/${itinerary._id}`}
											target='_blank'
											rel='noopener noreferrer'
											className='text-blue-400 hover:text-blue-600'
											aria-label='Share on Twitter'>
											<FaTwitter size={18} />
										</a>
										<a
											href={`https://instagram.com/?url=http://localhost:5173/itineraries/${itinerary._id}`}
											target='_blank'
											rel='noopener noreferrer'
											className='text-pink-500 hover:text-pink-700'
											aria-label='Share on Instagram'>
											<FaInstagram size={18} />
										</a>
										<a
											href={`https://linkedin.com/shareArticle?mini=true&url=http://localhost:5173/itineraries/${itinerary._id}`}
											target='_blank'
											rel='noopener noreferrer'
											className='text-blue-700 hover:text-blue-900'
											aria-label='Share on LinkedIn'>
											<FaLinkedinIn size={18} />
										</a>
									</div>
								</div>
							</div>

							{/* Bookmark Icon */}
							<button
								onClick={() => handleBookmark(itinerary._id)}
								className='text-blue-500 hover:text-blue-700 transition-colors duration-200'
								aria-label='Bookmark Itinerary'>
								<FiBookmark size={24} />
							</button>
						</div>
					</div>
				))
			) : (
				<p className='text-center text-gray-500 w-full'>
					No itineraries available.
				</p>
			)}

			{/* Confirmation Modal for Booking */}
			{isModalOpen && selectedItinerary && (
				<div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-80'>
						<h3 className='text-lg font-semibold text-center mb-4'>
							Confirm Booking
						</h3>
						<p className='text-center mb-6'>
							Price: ${(selectedItinerary.price * conversionRate).toFixed(2)}{' '}
							{currency}
						</p>
						<div className='flex justify-between'>
							<button
								onClick={() => setIsModalOpen(false)}
								className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200'>
								Cancel
							</button>
							<button
								onClick={confirmBooking}
								className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200'>
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
