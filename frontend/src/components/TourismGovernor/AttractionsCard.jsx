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
		<div>
			{/* Filter Section */}
			<div className='mb-4'>
				<label
					htmlFor='filter'
					className='font-semibold text-gray-700'>
					Filter by Tag:
				</label>
				<select
					id='filter'
					className='ml-2 border border-gray-300 rounded-md p-2'
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
			<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6'>
				{filteredAttractions.length > 0 ? (
					filteredAttractions.map((attraction) => (
						<div
							key={attraction._id}
							className='border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow duration-300 transform hover:scale-105'>
							<div className='flex flex-col h-full space-y-6'>
								<h2 className='text-2xl font-semibold text-blue-900'>
									{attraction.name || 'No name provided'}
								</h2>

								{/* Description */}
								<ul className='list-disc pl-6 text-left text-gray-800 space-y-3'>
									<li>
										<span className='font-semibold'>Governor: </span>
										{attraction.governorId?.username || 'NA'}
									</li>
									<li>
										<span className='font-semibold'>Description: </span>
										{attraction.description || 'No description available.'}
									</li>

									{/* Pictures */}
									{attraction.pictures && attraction.pictures.length > 0 && (
										<li>
											<span className='font-semibold'>Pictures: </span>
											<ul className='list-disc pl-6 space-y-1'>
												{attraction.pictures.map((pic, index) => (
													<li
														key={index}
														className='ml-6'>
														{pic}
													</li>
												))}
											</ul>
										</li>
									)}

									{/* Location */}
									<li>
										<span className='font-semibold'>Location: </span>
										{attraction.location || 'Location not specified.'}
									</li>

									{/* Opening Hours */}
									<li>
										<span className='font-semibold'>Opening Hours: </span>
										{attraction.openingHours || 'Hours not available.'}
									</li>

									{/* Ticket Prices */}
									<li>
										<span className='font-semibold'>Ticket Prices: </span>
										<ul className='list-disc pl-6 space-y-1'>
											{attraction.ticketPrices ? (
												<>
													<li className='ml-6'>
														<span className='font-semibold'>Natives: </span>
														{(
															attraction.ticketPrices.native * conversionRate
														).toFixed(1) || 'N/A'}{' '}
														{currency}
													</li>
													<li className='ml-6'>
														<span className='font-semibold'>Foreigners: </span>
														{(
															attraction.ticketPrices.foreigner * conversionRate
														).toFixed(1) || 'N/A'}{' '}
														{currency}
													</li>
													<li className='ml-6'>
														<span className='font-semibold'>Students: </span>
														{(
															attraction.ticketPrices.student * conversionRate
														).toFixed(1) || 'N/A'}{' '}
														{currency}
													</li>
												</>
											) : (
												'Prices not available'
											)}
										</ul>
									</li>

									{/* Tags */}
									{attraction.tags && attraction.tags.length > 0 && (
										<li>
											<span className='font-semibold'>Tags: </span>
											<ul className='list-disc pl-6 space-y-1'>
												{attraction.tags.map((tag, index) => (
													<li
														key={index}
														className='ml-6'>
														{tag || 'No tag name'}
													</li>
												))}
											</ul>
										</li>
									)}
								</ul>

								{/* Book and Share Buttons */}
								<div className='flex flex-col space-y-2 mt-4'>
									<button
										className='py-2 px-4 bg-blue-600 text-white rounded-md'
										onClick={() => handleBookTicket(attraction)}>
										Book Ticket
									</button>
									<div className='relative'>
										<div className='flex justify-between'>
											<button
												onClick={toggleShareOptions}
												className='bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 mt-2'>
												Share
											</button>
											<button
												onClick={() => handleBookmark(attraction._id)}
												className='text-blue-500 hover:text-blue-700'>
												<FiBookmark size={24} />
											</button>
										</div>
										{shareOptionsVisible && (
											<div className='absolute bg-white border rounded shadow-md p-2 mt-1'>
												<button
													onClick={() => handleCopyLink(attraction)}
													className='text-blue-600 hover:underline block'>
													Copy Link
												</button>
												<button
													onClick={() => handleShareViaEmail(attraction)}
													className='text-blue-600 hover:underline block'>
													Share via Email
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<p className='text-center text-gray-500 col-span-full'>
						No attractions available.
					</p>
				)}
			</div>

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
									{currency} {ticketPrice || 'N/A'}
								</p>
								<button
									className='mt-4 py-2 px-4 bg-green-600 text-white rounded-md'
									onClick={confirmBooking}>
									Confirm Booking
								</button>
							</div>
						)}
						<button
							className='mt-4 py-2 px-4 bg-red-600 text-white rounded-md'
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
