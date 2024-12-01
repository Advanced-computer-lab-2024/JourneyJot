/** @format */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../../components/Helper/StarRating';

const SharedItineraryPage = () => {
	const { id } = useParams();
	const [itinerary, setItinerary] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchItinerary = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/itineraries/${id}`
				);
				setItinerary(response.data);
			} catch (err) {
				setError('Failed to load itinerary details. Please try again later.');
			}
		};
		fetchItinerary();
	}, [id]);

	if (error) return <p className='text-center text-red-500'>{error}</p>;

	return (
		<div className='max-w-2xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow-lg mt-10'>
			{itinerary ? (
				<>
					<h1 className='text-3xl font-bold text-gray-900 mb-6'>
						Itinerary Details
					</h1>
					<ul className='space-y-4'>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Tour Guide Name:</span>
							<span>{itinerary.tourGuideId?.username || 'Unknown'}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Activities:</span>
							<span>{itinerary.activities.join(', ')}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Locations:</span>
							<span>{itinerary.locations.join(', ')}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Timeline:</span>
							<span>{itinerary.timeline}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Duration:</span>
							<span>{itinerary.duration}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Language:</span>
							<span>{itinerary.language}</span>
						</li>
						<li className='text-gray-800 flex justify-between items-center'>
							<span className='font-semibold'>Rating:</span>
							<StarRating rating={itinerary.rating || 0} />
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Accessibility:</span>
							<span>{itinerary.accessibility}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Pick-Up Location:</span>
							<span>{itinerary.pickupLocation}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Drop-Off Location:</span>
							<span>{itinerary.dropoffLocation}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Available Dates:</span>
							<span>{itinerary.availableDates.join(', ')}</span>
						</li>
					</ul>
				</>
			) : (
				<p className='text-center text-gray-500'>
					Loading itinerary details...
				</p>
			)}
		</div>
	);
};

export default SharedItineraryPage;
