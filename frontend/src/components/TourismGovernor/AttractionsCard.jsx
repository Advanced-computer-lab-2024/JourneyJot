/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBookmark } from 'react-icons/fi';
import { MdPayment } from 'react-icons/md';
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
} from 'react-icons/fa';
import StarRating from '../Helper/StarRating'; // Ensure this component exists and is properly implemented
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttractionsCard = ({ currency, conversionRate = 1 }) => {
	const [attractions, setAttractions] = useState([]);
	const [tags, setTags] = useState([]);
	const [selectedTag, setSelectedTag] = useState('');
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [selectedAttraction, setSelectedAttraction] = useState(null);
	const [selectedTicketType, setSelectedTicketType] = useState('');
	const [ticketPrice, setTicketPrice] = useState(null); // NEW state for ticket price
	const navigate = useNavigate(); // Ensure you have imported useNavigate from 'react-router-dom'

	// Fetch data from the API using axios
	useEffect(() => {
		const fetchAttractions = async () => {
			try {
				const response = await axios.get('http://localhost:3000/attractions'); // Replace with your API endpoint for attractions
				setAttractions(response.data);
				const allTags = response.data.flatMap((attraction) => attraction.tags);
				const uniqueTags = [...new Set(allTags)];
				setTags(uniqueTags);
			} catch (error) {
				console.error('Error fetching attractions:', error);
				toast.error('Failed to fetch attractions.');
			}
		};

		fetchAttractions();
	}, []);

	const handleFilterChange = (event) => {
		setSelectedTag(event.target.value);
	};

	const filteredAttractions = selectedTag
		? attractions.filter(
				(attraction) => attraction.tags && attraction.tags.includes(selectedTag)
		  )
		: attractions;

	const handleBookTicket = (attraction) => {
		setSelectedAttraction(attraction);
		setIsConfirmModalOpen(true);
	};

	const handleTicketTypeChange = (ticketType) => {
		setSelectedTicketType(ticketType);
		if (ticketType && selectedAttraction.ticketPrices[ticketType]) {
			const calculatedPrice =
				selectedAttraction.ticketPrices[ticketType] * conversionRate;
			setTicketPrice(calculatedPrice.toFixed(2)); // Update the ticket price state
		} else {
			setTicketPrice(null);
		}
	};

	const confirmBooking = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const response = await axios.post(
				'http://localhost:3000/tourists/bookAttraction',
				{
					attractionId: selectedAttraction._id, // Pass the selected attraction ID
					ticketType: selectedTicketType, // Pass the selected ticket type (e.g., 'native')
				},
				config
			);

			const { message, updatedWalletBalance, pointsEarned, totalPoints } =
				response.data;

			// Display a success toast with wallet and points details
			toast.success(
				`${message}. You earned ${pointsEarned} points! Your total points are now ${totalPoints}. Wallet balance: $${updatedWalletBalance}.`
			);

			setIsConfirmModalOpen(false); // Close the modal after booking
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || 'An error occurred.';
			toast.error(`Booking failed: ${errorMessage}`);
			console.error('Error booking attraction:', error);
			setIsConfirmModalOpen(false);
		}
	};

	const handleCopyLink = (attraction) => {
		const link = `http://localhost:5173/attractions/${attraction._id}`;
		navigator.clipboard.writeText(link);
		toast.info('Link copied to clipboard!');
	};

	const handleShareViaEmail = (attraction) => {
		const subject = encodeURIComponent(`Check out this attraction`);
		const body = encodeURIComponent(
			`Here is a link to the attraction: http://localhost:5173/attractions/${attraction._id}`
		);
		window.location.href = `mailto:?subject=${subject}&body=${body}`;
	};

	const handlePayAttractionViaStripe = (attraction) => {
		navigate('/pay-attraction-stripe', {
			state: {
				attraction: attraction, // Pass only the serializable attraction data
				currency: currency,
				conversionRate: conversionRate,
			},
		});
	};

	const handleBookmark = async (attractionId) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const response = await axios.post(
				'http://localhost:3000/tourists/bookMarkAttraction',
				{ attractionId },
				config
			);

			toast.success(
				response.data.message || 'Attraction bookmarked successfully!'
			);
		} catch (error) {
			console.error('Error bookmarking Attraction:', error);
			const errorMessage =
				error.response?.data?.message ||
				'Failed to bookmark Attraction. Try again later.';
			toast.error(`Bookmark failed: ${errorMessage}`);
		}
	};

	return (
		<div className='flex flex-col items-center py-10'>
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

			{/* Filter Section */}
			<div className='w-full max-w-7xl px-4 mb-8'>
				<label
					htmlFor='filter'
					className='block text-lg font-semibold text-gray-800 mb-2'>
					Filter by Tag:
				</label>
				<select
					id='filter'
					className='w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none'
					value={selectedTag}
					onChange={handleFilterChange}>
					<option value=''>All Tags</option>
					{tags.map((tag, index) => (
						<option
							key={index}
							value={tag}>
							{tag}
						</option>
					))}
				</select>
			</div>

			{/* Attractions Grid */}
			<div className='w-full max-w-7xl grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4'>
				{filteredAttractions.length > 0 ? (
					filteredAttractions.map((attraction) => (
						<div
							key={attraction._id}
							className='relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
							{/* Attraction Details */}
							<div className='p-4 space-y-2'>
								<h2 className='text-xl font-semibold text-blue-900 truncate'>
									{attraction.name || 'Attraction Name'}
								</h2>
								<ul className='space-y-1 text-gray-700 text-sm'>
									<li>
										<span className='font-medium'>Governor:</span>{' '}
										{attraction.governorId?.username || 'N/A'}
									</li>
									<li>
										<span className='font-medium'>Description:</span>{' '}
										{attraction.description || 'Not available'}
									</li>
									<li>
										<span className='font-medium'>Location:</span>{' '}
										{attraction.location || 'Not specified'}
									</li>
									<li>
										<span className='font-medium'>Opening Hours:</span>{' '}
										{attraction.openingHours || 'Not available'}
									</li>
									<li>
										<span className='font-medium'>Ticket Prices:</span>
										{attraction.ticketPrices ? (
											<ul className='pl-6 space-y-1'>
												<li>
													Natives:{' '}
													{(
														attraction.ticketPrices.native * conversionRate
													).toFixed(2) || 'N/A'}{' '}
													{currency}
												</li>
												<li>
													Foreigners:{' '}
													{(
														attraction.ticketPrices.foreigner * conversionRate
													).toFixed(2) || 'N/A'}{' '}
													{currency}
												</li>
												<li>
													Students:{' '}
													{(
														attraction.ticketPrices.student * conversionRate
													).toFixed(2) || 'N/A'}{' '}
													{currency}
												</li>
											</ul>
										) : (
											'Not available'
										)}
									</li>
									{attraction.tags?.length > 0 && (
										<li>
											<span className='font-medium'>Tags:</span>{' '}
											{attraction.tags.join(', ')}
										</li>
									)}
								</ul>

								{/* Star Rating */}
								<div className='flex items-center'>
									<StarRating rating={attraction.rating || 0} />
									<span className='ml-2 text-gray-600 text-sm'>
										({attraction.num_reviews || 0})
									</span>
								</div>

								{/* Action Buttons */}
								<div className='mt-4 flex flex-col space-y-2'>
									{/* Book Ticket Button */}
									<button
										onClick={() => handleBookTicket(attraction)}
										className='flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200'>
										Book Ticket
									</button>

									{/* Pay via Stripe Button */}
									<button
										onClick={() => handlePayAttractionViaStripe(attraction)}
										className='flex items-center justify-center bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-500 transition-colors duration-200'>
										<MdPayment className='mr-2' /> Pay via Stripe
									</button>
								</div>
							</div>

							{/* Share and Bookmark Icons */}
							<div className='flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200'>
								{/* Share Options are always visible */}
								<div className='relative'>
									<div className='mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-20'>
										<div className='p-2'>
											{/* Copy Link */}
											<button
												onClick={() => handleCopyLink(attraction)}
												className='flex items-center w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
												Copy Link
											</button>
											{/* Share via Email */}
											<button
												onClick={() => handleShareViaEmail(attraction)}
												className='flex items-center w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
												Share via Email
											</button>
										</div>
										{/* Social Media Share Icons */}
										<div className='flex justify-around p-2 border-t border-gray-200 bg-gray-50'>
											<a
												href={`https://facebook.com/sharer/sharer.php?u=http://localhost:5173/attractions/${attraction._id}`}
												target='_blank'
												rel='noopener noreferrer'
												className='text-blue-600 hover:text-blue-800'
												aria-label='Share on Facebook'>
												<FaFacebookF size={20} />
											</a>
											<a
												href={`https://twitter.com/intent/tweet?url=http://localhost:5173/attractions/${attraction._id}`}
												target='_blank'
												rel='noopener noreferrer'
												className='text-blue-400 hover:text-blue-600'
												aria-label='Share on Twitter'>
												<FaTwitter size={20} />
											</a>
											<a
												href={`https://instagram.com/?url=http://localhost:5173/attractions/${attraction._id}`}
												target='_blank'
												rel='noopener noreferrer'
												className='text-pink-500 hover:text-pink-700'
												aria-label='Share on Instagram'>
												<FaInstagram size={20} />
											</a>
											<a
												href={`https://linkedin.com/shareArticle?mini=true&url=http://localhost:5173/attractions/${attraction._id}`}
												target='_blank'
												rel='noopener noreferrer'
												className='text-blue-700 hover:text-blue-900'
												aria-label='Share on LinkedIn'>
												<FaLinkedinIn size={20} />
											</a>
										</div>
									</div>
								</div>

								{/* Bookmark Icon */}
								<button
									onClick={() => handleBookmark(attraction._id)}
									className='text-blue-500 hover:text-blue-700 transition-colors duration-200'
									aria-label='Bookmark Attraction'>
									<FiBookmark size={20} />
								</button>
							</div>
						</div>
					))
				) : (
					<p className='text-center text-gray-500 col-span-full'>
						No attractions available.
					</p>
				)}
			</div>

			{/* Confirmation Modal for Booking */}
			{/* Ticket Selection Modal */}
			{isConfirmModalOpen && selectedAttraction && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-80'>
						<h3 className='text-lg font-semibold'>Select Ticket Type</h3>
						<div className='mb-4'>
							<label className='font-semibold text-gray-700'>
								Choose a ticket:
							</label>
							<select
								value={selectedTicketType}
								onChange={(e) => handleTicketTypeChange(e.target.value)}
								className='ml-2 border border-gray-300 rounded-md p-2'>
								<option value=''>Select Ticket Type</option>
								{selectedAttraction.ticketPrices && (
									<>
										{selectedAttraction.ticketPrices.native && (
											<option value='native'>Natives</option>
										)}
										{selectedAttraction.ticketPrices.foreigner && (
											<option value='foreigner'>Foreigners</option>
										)}
										{selectedAttraction.ticketPrices.student && (
											<option value='student'>Students</option>
										)}
									</>
								)}
							</select>
						</div>
						{selectedTicketType && (
							<div>
								<p className='font-semibold'>Price: </p>
								<p>
									{currency}{' '}
									{(
										selectedAttraction.ticketPrices[selectedTicketType] *
										conversionRate
									).toFixed(2) || 'N/A'}
								</p>
								<button
									className='mt-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200'
									onClick={confirmBooking}>
									Confirm Booking
								</button>
							</div>
						)}
						<button
							className='mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200'
							onClick={() => setIsConfirmModalOpen(false)}>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AttractionsCard;
