/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBookmark } from 'react-icons/fi';

const AttractionsCard = ({ currency, conversionRate = 1 }) => {
	const [attractions, setAttractions] = useState([]);
	const [tags, setTags] = useState([]);
	const [selectedTag, setSelectedTag] = useState('');
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [selectedAttraction, setSelectedAttraction] = useState(null);
	const [selectedTicketType, setSelectedTicketType] = useState('');
	const [ticketPrice, setTicketPrice] = useState(null); // NEW state for ticket price
	const [error, setError] = useState(null);
	const [shareOptionsVisible, setShareOptionsVisible] = useState(false);

	// Fetch data from the API using axios
	useEffect(() => {
		axios
			.get('http://localhost:3000/attractions') // Replace with your API endpoint for attractions
			.then((response) => {
				setAttractions(response.data);
				const allTags = response.data.flatMap((attraction) => attraction.tags);
				const uniqueTags = [...new Set(allTags)];
				setTags(uniqueTags);
			})
			.catch((error) => {
				console.error('Error fetching attractions:', error);
			});
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

			console.log('Booking successful:', response.data);
			setIsConfirmModalOpen(false);
		} catch (error) {
			console.error('Error booking attraction:', error);
			setError(error.response?.data?.message || 'An error occurred.');
		}
	};

	const handleCopyLink = (attraction) => {
		const link = `http://localhost:5173/attractions/${attraction._id}`;
		navigator.clipboard.writeText(link);
		alert('Link copied to clipboard!');
	};

	const handleShareViaEmail = (attraction) => {
		const subject = encodeURIComponent(`Check out this activity`);
		const body = encodeURIComponent(
			`Here is a link to the activity: http://localhost:5173/attractions/${attraction._id}`
		);
		window.location.href = `mailto:?subject=${subject}&body=${body}`;
	};

	const toggleShareOptions = () => {
		setShareOptionsVisible(!shareOptionsVisible);
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

			alert(response.data.message || 'Attraction bookmarked successfully!');
		} catch (error) {
			console.error('Error bookmarking Attraction:', error);
			alert(
				error.response?.data?.message ||
					'Failed to bookmark Attraction. Try again later.'
			);
		}
	};

	return (
		<div className='min-h-screen flex flex-col items-center py-10'>
			{/* Filter Section */}
			<div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
				<label
					htmlFor='filter'
					className='block text-lg font-semibold text-gray-800'>
					Filter by Tag:
				</label>
				<select
					id='filter'
					className='w-full mt-2 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none'
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
			<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 w-full max-w-7xl'>
				{filteredAttractions.length > 0 ? (
					filteredAttractions.map((attraction) => (
						<div
							key={attraction._id}
							className='border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300'>
							<div className='flex flex-col h-full space-y-4'>
								<h2 className='text-xl font-bold text-gray-900 truncate'>
									{attraction.name || 'No name provided'}
								</h2>
								<ul className='text-gray-700 space-y-2'>
									<li>
										<strong>Governor:</strong>{' '}
										{attraction.governorId?.username || 'NA'}
									</li>
									<li>
										<strong>Description:</strong>{' '}
										{attraction.description || 'Not available'}
									</li>
									<li>
										<strong>Location:</strong>{' '}
										{attraction.location || 'Not specified'}
									</li>
									<li>
										<strong>Opening Hours:</strong>{' '}
										{attraction.openingHours || 'Not available'}
									</li>
									<li>
										<strong>Ticket Prices:</strong>
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
											<strong>Tags:</strong> {attraction.tags.join(', ')}
										</li>
									)}
								</ul>
								<div className='mt-auto'>
									<button className='w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
										Book Ticket
									</button>
									<div className='flex justify-between items-center mt-3'>
										<button
											onClick={toggleShareOptions}
											className='py-1 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600'>
											Share
										</button>
										<button
											onClick={() => handleBookmark(attraction._id)}
											className='text-blue-500 hover:text-blue-700'>
											<FiBookmark size={20} />
										</button>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<p className='text-center text-gray-600 col-span-full'>
						No attractions available.
					</p>
				)}
			</div>

			{/* Error Notification */}
			{error && (
				<div className='fixed bottom-5 right-5 bg-red-500 text-white py-3 px-5 rounded-lg shadow-lg'>
					<div className='flex justify-between items-center'>
						<span>{error}</span>
						<button
							onClick={() => setError(null)}
							className='text-xl font-bold'>
							×
						</button>
					</div>
				</div>
			)}

			{/* Ticket Selection Modal */}
			{isConfirmModalOpen && selectedAttraction && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
					<div className='bg-white rounded-lg p-6 w-80 shadow-lg'>
						<h3 className='text-lg font-semibold text-gray-900'>
							Select Ticket Type
						</h3>
						<select
							className='w-full mt-3 border border-gray-300 rounded-lg p-2'
							value={selectedTicketType}
							onChange={(e) => handleTicketTypeChange(e.target.value)}>
							<option value=''>Select Ticket Type</option>
							{selectedAttraction.ticketPrices?.native && (
								<option value='native'>Natives</option>
							)}
							{selectedAttraction.ticketPrices?.foreigner && (
								<option value='foreigner'>Foreigners</option>
							)}
							{selectedAttraction.ticketPrices?.student && (
								<option value='student'>Students</option>
							)}
						</select>
						{selectedTicketType && (
							<p className='mt-4 text-gray-700'>
								<strong>Price:</strong> {currency} {ticketPrice || 'N/A'}
							</p>
						)}
						<div className='mt-6 flex justify-end space-x-4'>
							<button
								onClick={() => setIsConfirmModalOpen(false)}
								className='py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600'>
								Close
							</button>
							<button
								onClick={confirmBooking}
								className='py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700'>
								Confirm Booking
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AttractionsCard;
