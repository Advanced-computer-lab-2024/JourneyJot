/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Importing the star icons

const CompletedItineraryInfo = () => {
	const { id } = useParams();
	const [itinerary, setItinerary] = useState(null); // State to store itinerary data
	const [loading, setLoading] = useState(true); // State for loading state
	const [error, setError] = useState(null); // State for any errors
	const [showRatings, setShowRatings] = useState(false); // State to toggle the ratings dropdown

	useEffect(() => {
		const fetchItinerary = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					throw new Error('No token found. Please login again.');
				}
				const config = { headers: { Authorization: `Bearer ${token}` } };
				const response = await axios.get(
					`http://localhost:3000/itineraries/${id}`,
					config
				);
				setItinerary(response.data);
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};

		fetchItinerary();
	}, [id]);

	if (loading) {
		return <div className='text-center text-lg font-semibold'>Loading...</div>;
	}

	if (error) {
		return (
			<div className='text-center text-lg font-semibold text-red-500'>
				Error: {error}
			</div>
		);
	}

	const renderStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			if (i <= rating) {
				stars.push(
					<FaStar
						key={i}
						className='text-yellow-500'
					/>
				);
			} else {
				stars.push(
					<FaRegStar
						key={i}
						className='text-yellow-300'
					/>
				);
			}
		}
		return stars;
	};

	return (
		<div className='max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg space-y-6'>
			<h1 className='text-3xl font-semibold text-center text-gray-800'>
				Itinerary Details
			</h1>

			{/* Itinerary Details */}
			<div className='space-y-6'>
				<div className='flex justify-between items-center'>
					<span className='font-bold text-gray-700'>Tour Guide Name:</span>
					<span>{itinerary.tourGuideId.username}</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='font-bold text-gray-700'>Language:</span>
					<span>{itinerary.language}</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='font-bold text-gray-700'>Duration:</span>
					<span>{itinerary.duration}</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='font-bold text-gray-700'>Price:</span>
					<span>${itinerary.price}</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='font-bold text-gray-700'>Accessibility:</span>
					<span>{itinerary.accessibility}</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='font-bold text-gray-700'>Pickup Location:</span>
					<span>{itinerary.pickupLocation}</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='font-bold text-gray-700'>Drop-off Location:</span>
					<span>{itinerary.dropoffLocation}</span>
				</div>

				<div className='flex justify-between items-center'>
					<span className='font-bold text-gray-700'>Flagged:</span>
					<span>{itinerary.flagged ? 'Yes' : 'No'}</span>
				</div>

				{itinerary.availableDates && itinerary.availableDates.length > 0 && (
					<div>
						<span className='font-bold text-gray-700'>Available Dates:</span>
						<div className='space-y-2'>
							{itinerary.availableDates.map((dateObj, index) => (
								<p key={index}>{new Date(dateObj).toLocaleDateString()}</p>
							))}
						</div>
					</div>
				)}

				<div>
					<span className='font-bold text-gray-700'>Activities:</span>
					<ul className='space-y-2'>
						{itinerary.activities.map((activity, index) => (
							<li key={index}>{activity}</li>
						))}
					</ul>
				</div>

				<div>
					<span className='font-bold text-gray-700'>Locations:</span>
					<ul className='space-y-2'>
						{itinerary.locations.map((location, index) => (
							<li key={index}>{location}</li>
						))}
					</ul>
				</div>

				<div>
					<span className='font-bold text-gray-700'>Timeline:</span>
					<p>{itinerary.timeline}</p>
				</div>

				{/* Ratings dropdown */}
				<div className='relative'>
					<div
						onClick={() => setShowRatings(!showRatings)}
						className='cursor-pointer text-blue-500 font-semibold'>
						{itinerary.ratings.length}{' '}
						{itinerary.ratings.length === 1 ? 'Rating' : 'Ratings'}
					</div>

					{showRatings && (
						<div className='absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-full max-h-48 overflow-y-auto'>
							<div className='p-4'>
								{itinerary.ratings.map((rating, index) => (
									<div
										key={index}
										className={`border-b border-gray-300 pb-4 ${
											index !== itinerary.ratings.length - 1 ? 'mb-4' : ''
										}`}>
										<div className='flex justify-between items-center'>
											<span className='font-bold text-gray-800'>User:</span>
											<span>
												{rating.userId ? rating.userId.username : 'Anonymous'}
											</span>
										</div>
										<div className='flex justify-between items-center'>
											<span className='font-bold text-gray-800'>Rating:</span>
											<div className='flex'>
												{renderStars(rating.rating || 0)}
											</div>
										</div>
										<div className='flex justify-between items-center'>
											<span className='font-bold text-gray-800'>Comment:</span>
											<span>{rating.comment || 'No comment'}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CompletedItineraryInfo;
