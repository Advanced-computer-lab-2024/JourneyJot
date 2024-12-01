/** @format */

// SharedActivityPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../../components/Helper/StarRating';

const SharedActivityPage = () => {
	const { id } = useParams(); // Get activity ID from URL
	const [activity, setActivity] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Fetch activity details by ID
		const fetchActivity = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/activities/${id}`
				);
				setActivity(response.data);
			} catch (err) {
				setError('Failed to load activity details. Please try again later.');
			}
		};
		fetchActivity();
	}, [id]);

	if (error) return <p className='text-center text-red-500'>{error}</p>;

	return (
		<div className='max-w-2xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow-lg mt-10'>
			{activity ? (
				<>
					<h1 className='text-3xl font-bold text-gray-900 mb-6'>
						{activity.name}
					</h1>
					<ul className='space-y-4'>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Advertiser Name:</span>
							<span>{activity.advertiserId?.username || 'N/A'}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Date:</span>
							<span>{new Date(activity.date).toLocaleDateString()}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Time:</span>
							<span>{activity.time}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Category:</span>
							<span>{activity.category?.name || 'N/A'}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Tag:</span>
							<span>{activity.preferenceTag?.name || 'N/A'}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Special Discounts:</span>
							<span>{activity.specialDiscounts || 'N/A'}</span>
						</li>
						<li className='text-gray-800 flex justify-between'>
							<span className='font-semibold'>Booking Status:</span>
							<span
								className={
									activity.bookingOpen ? 'text-green-600' : 'text-red-600'
								}>
								{activity.bookingOpen ? 'Open' : 'Closed'}
							</span>
						</li>
						<li className='text-gray-800 flex justify-between items-center'>
							<span className='font-semibold'>Rating:</span>
							{activity.rating ? (
								<StarRating rating={activity.rating} />
							) : (
								<span className='text-gray-500'>N/A</span>
							)}
						</li>
					</ul>
				</>
			) : (
				<p className='text-center text-gray-500'>Loading activity details...</p>
			)}
		</div>
	);
};

export default SharedActivityPage;
