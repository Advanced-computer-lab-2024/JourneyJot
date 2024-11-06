/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttractionsCard = () => {
	const [attractions, setAttractions] = useState([]);
	const [tags, setTags] = useState([]);
	const [selectedTag, setSelectedTag] = useState('');

	// Fetch data from the API using axios
	useEffect(() => {
		// Fetch attractions data
		axios
			.get('http://localhost:3000/attractions') // Replace with your API endpoint for attractions
			.then((response) => {
				setAttractions(response.data);
				// Extract tags from the attractions or another API endpoint
				const allTags = response.data.flatMap((attraction) => attraction.tags);
				const uniqueTags = [...new Set(allTags)]; // Remove duplicate tags
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

	const handleShareAttraction = (attraction) => {
		alert(`Share link for itinerary: ${attraction.name}`);
		// Implement actual sharing logic here
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
								{/* Name */}
								<h2 className='text-2xl font-semibold text-blue-900'>
									{attraction.name || 'No name provided'}
								</h2>

								{/* Description */}
								<p className='text-gray-700 text-base'>
									{attraction.description || 'No description available.'}
								</p>

								{/* Pictures */}
								{attraction.pictures && attraction.pictures.length > 0 && (
									<div className='text-gray-700'>
										<span className='font-semibold'>Pictures: </span>
										<ul className='list-disc pl-5'>
											{attraction.pictures.map((pic, index) => (
												<li key={index}>{pic}</li>
											))}
										</ul>
									</div>
								)}

								{/* Location */}
								<div className='text-gray-700'>
									<span className='font-semibold'>Location: </span>
									{attraction.location || 'Location not specified.'}
								</div>

								{/* Opening Hours */}
								<div className='text-gray-700'>
									<span className='font-semibold'>Opening Hours: </span>
									{attraction.openingHours || 'Hours not available.'}
								</div>

								{/* Ticket Prices */}
								<div>
									<h3 className='text-lg font-semibold text-gray-800'>
										Ticket Prices:
									</h3>
									<ul className='mt-2 space-y-1 text-gray-700'>
										{attraction.ticketPrices ? (
											<>
												<li>
													<span className='font-semibold'>Natives: </span>$
													{attraction.ticketPrices.native || 'N/A'}
												</li>
												<li>
													<span className='font-semibold'>Foreigners: </span>$
													{attraction.ticketPrices.foreigner || 'N/A'}
												</li>
												<li>
													<span className='font-semibold'>Students: </span>$
													{attraction.ticketPrices.student || 'N/A'}
												</li>
											</>
										) : (
											<li>Prices not available</li>
										)}
									</ul>
								</div>

								{/* Tags */}
								{attraction.tags && attraction.tags.length > 0 && (
									<div className='text-gray-700'>
										<span className='font-semibold'>Tags: </span>
										<ul className='list-disc pl-5'>
											{attraction.tags.map((tag, index) => (
												<li key={index}>{tag || 'No tag name'}</li>
											))}
										</ul>
									</div>
								)}

								{/* Share Button */}
								<button
									className='mt-4 py-2 px-4 bg-blue-600 text-white rounded-md'
									onClick={() => handleShareAttraction(attraction)}>
									Share
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
		</div>
	);
};

export default AttractionsCard;
