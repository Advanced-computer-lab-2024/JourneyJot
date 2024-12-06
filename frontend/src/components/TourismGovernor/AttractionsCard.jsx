/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBookmark, FiShare2 } from 'react-icons/fi';
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
	const [ticketPrice, setTicketPrice] = useState(null); // State for ticket price
	const [loading, setLoading] = useState({
		fetchAttractions: false,
		book: false,
	});
	const [shareOptionsVisible, setShareOptionsVisible] = useState({});
	const navigate = useNavigate();

	// Fetch data from the API using axios
	useEffect(() => {
		const fetchAttractions = async () => {
			setLoading((prev) => ({ ...prev, fetchAttractions: true }));
			try {
				const response = await axios.get('http://localhost:3000/attractions'); // Replace with your API endpoint for attractions
				setAttractions(response.data);
				const allTags = response.data.flatMap(
					(attraction) => attraction.tags || []
				);
				const uniqueTags = [...new Set(allTags)];
				setTags(uniqueTags);
				toast.success('Attractions fetched successfully!');
			} catch (error) {
				console.error('Error fetching attractions:', error);
				toast.error('Failed to fetch attractions. Please try again later.');
			} finally {
				setLoading((prev) => ({ ...prev, fetchAttractions: false }));
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
		if (!attraction.bookingOpen || attraction.isBooked) {
			toast.info('This attraction is not available for booking.');
			return;
		}
		setSelectedAttraction(attraction);
		setSelectedTicketType(''); // Reset ticket type selection
		setTicketPrice(null); // Reset ticket price
		setIsConfirmModalOpen(true);
	};

	const handleTicketTypeChange = (ticketType) => {
		// Ensure ticketType matches backend's expected casing
		const formattedType = ticketType.toLowerCase();
		setSelectedTicketType(formattedType);
		if (formattedType && selectedAttraction.ticketPrices[formattedType]) {
			const calculatedPrice =
				selectedAttraction.ticketPrices[formattedType] * conversionRate;
			setTicketPrice(calculatedPrice.toFixed(2)); // Update the ticket price state
		} else {
			setTicketPrice(null);
		}
	};

	const confirmBooking = async () => {
		if (!selectedTicketType) {
			toast.error('Please select a ticket type before booking.');
			return;
		}

		setLoading((prev) => ({ ...prev, book: true }));
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			// Debugging: Log the data being sent
			console.log('Booking Data:', {
				attractionId: selectedAttraction._id,
				ticketType: selectedTicketType,
			});

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

			// Update the attraction's booking status in the frontend state
			setAttractions((prevAttractions) =>
				prevAttractions.map((att) =>
					att._id === selectedAttraction._id ? { ...att, isBooked: true } : att
				)
			);

			setIsConfirmModalOpen(false); // Close the modal after booking
			setSelectedAttraction(null); // Reset selected attraction
			setSelectedTicketType(''); // Reset ticket type
			setTicketPrice(null); // Reset ticket price
		} catch (error) {
			const errorMsg =
				error.response?.data?.message || 'An error occurred while booking.';
			toast.error(errorMsg); // Display error toast
			console.error('Error booking attraction:', error);
			setIsConfirmModalOpen(false);
		} finally {
			setLoading((prev) => ({ ...prev, book: false }));
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

	const toggleShareOptions = (attractionId) => {
		setShareOptionsVisible((prev) => ({
			...prev,
			[attractionId]: !prev[attractionId],
		}));
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
			const errorMsg =
				error.response?.data?.message ||
				'Failed to bookmark attraction. Try again later.';
			toast.error(errorMsg);
			console.error('Error bookmarking Attraction:', error);
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
				{loading.fetchAttractions ? (
					<div className='flex justify-center items-center col-span-full'>
						<div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16'></div>
					</div>
				) : filteredAttractions.length > 0 ? (
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
										className={`flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 ${
											!attraction.bookingOpen || attraction.isBooked
												? 'opacity-50 cursor-not-allowed'
												: ''
										}`}
										disabled={!attraction.bookingOpen || attraction.isBooked}>
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
								{/* Share Dropdown */}
								<div className='relative '>
									<button
										onClick={() => toggleShareOptions(attraction._id)}
										className='flex items-center text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-200'
										aria-label='Share Attraction'>
										<FiShare2
											size={22}
											className='mr-2'
										/>
										Share
									</button>

									{shareOptionsVisible[attraction._id] && (
										<div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20'>
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
									)}
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
			{isConfirmModalOpen && selectedAttraction && (
				<div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-80'>
						<h3 className='text-lg font-semibold text-center mb-4'>
							Confirm Booking
						</h3>

						{/* Ticket Type Selection */}
						<div className='mb-4'>
							<label
								htmlFor='ticketType'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Select Ticket Type:
							</label>
							<select
								id='ticketType'
								className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={selectedTicketType}
								onChange={(e) => handleTicketTypeChange(e.target.value)}>
								<option value=''>-- Select Ticket Type --</option>
								{selectedAttraction.ticketPrices &&
									Object.keys(selectedAttraction.ticketPrices).map((type) => (
										<option
											key={type}
											value={type}>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</option>
									))}
							</select>
						</div>

						{/* Display Ticket Price */}
						{ticketPrice && (
							<p className='text-center mb-4'>
								Price: {currency} {ticketPrice}
							</p>
						)}

						{/* Action Buttons */}
						<div className='flex justify-between'>
							<button
								onClick={() => setIsConfirmModalOpen(false)}
								className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200'>
								Cancel
							</button>
							<button
								onClick={confirmBooking}
								className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${
									loading.book ? 'opacity-50 cursor-not-allowed' : ''
								}`}
								disabled={loading.book}>
								{loading.book ? 'Booking...' : 'Confirm'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AttractionsCard;
