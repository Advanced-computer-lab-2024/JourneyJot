/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttractionsCard = ({
	currency,
	conversionRate = 1, // Default conversion rate is 1
}) => {
	const [attractions, setAttractions] = useState([]);
	const [tags, setTags] = useState([]);
	const [selectedTag, setSelectedTag] = useState('');
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal state
	const [selectedAttraction, setSelectedAttraction] = useState(null); // Selected attraction
	const [selectedTicketType, setSelectedTicketType] = useState(''); // Selected ticket type
	const [error, setError] = useState(null); // State to handle errors
	const [shareOptionsVisible, setShareOptionsVisible] = useState(false); // Toggle for share options

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

	// Handle the filtering based on selected tag
	const handleFilterChange = (event) => {
		setSelectedTag(event.target.value);
	};

	// Filter the attractions based on the selected tag
	const filteredAttractions = selectedTag
		? attractions.filter(
				(attraction) => attraction.tags && attraction.tags.includes(selectedTag)
		  )
		: attractions;

	// Handle the booking logic
	const handleBookTicket = (attraction) => {
		setSelectedAttraction(attraction); // Set selected attraction for booking
		setIsConfirmModalOpen(true); // Open the ticket selection modal
	};

	// Handle confirmation of ticket selection
	const confirmBooking = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const ticketPrice = selectedAttraction.ticketPrices[selectedTicketType];

			if (!ticketPrice) {
				throw new Error('Selected ticket type is unavailable.');
			}

			const response = await axios.post(
				'http://localhost:3000/tourists/bookAttraction',
				{
					attractionId: selectedAttraction._id,
					ticketType: selectedTicketType,
				},
				config
			);

			console.log(response);
			setIsConfirmModalOpen(false); // Close modal after booking
		} catch (error) {
			setError(error.response?.data?.message || 'An error occurred.'); // Set the error message in state
			console.error('Error booking attraction:', error);
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
								<ul className='list-disc pl-5 text-left text-gray-700 space-y-1'>
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
											<ul className='list-disc pl-5'>
												{attraction.pictures.map((pic, index) => (
													<li key={index}>{pic}</li>
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
										<ul className='list-disc pl-5'>
											{attraction.ticketPrices ? (
												<>
													<li>
														<span className='font-semibold'>Natives: </span>
														{(
															attraction.ticketPrices.native * conversionRate
														).toFixed(1) || 'N/A'}{' '}
														{currency}
													</li>
													<li>
														<span className='font-semibold'>Foreigners: </span>
														{(
															attraction.ticketPrices.foreigner * conversionRate
														).toFixed(1) || 'N/A'}{' '}
														{currency}
													</li>
													<li>
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
											<ul className='list-disc pl-5'>
												{attraction.tags.map((tag, index) => (
													<li key={index}>{tag || 'No tag name'}</li>
												))}
											</ul>
										</li>
									)}
								</ul>

								{/* Book and Share Buttons */}
								<div className='flex flex-col space-y-2 mt-4'>
									<button
										className='py-2 px-4 bg-green-600 text-white rounded-md'
										onClick={() => handleBookTicket(attraction)}>
										Book Ticket
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
							onClick={() => setError(null)} // Close error message when clicked
						>
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
								onChange={(e) => setSelectedTicketType(e.target.value)}
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
