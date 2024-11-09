/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityList = () => {
	const [activities, setActivities] = useState([]);
	const [error, setError] = useState(null);
	const [activityInputs, setActivityInputs] = useState({}); // Store ratings and comments per activity

	// Fetch activities (completed) from the backend
	useEffect(() => {
		const fetchActivities = async () => {
			const token = localStorage.getItem('token'); // Retrieve the token from localStorage

			if (!token) {
				setError('You need to log in to view activities.');
				return;
			}

			try {
				const response = await axios.get(
					'http://localhost:3000/activities/complete',
					{
						headers: {
							Authorization: `Bearer ${token}`, // Send the token in the Authorization header
						},
					}
				);

				setActivities(response.data.activities);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchActivities();
	}, []);

	// Handle rating and comment change for a specific activity
	const handleInputChange = (activityId, field, value) => {
		setActivityInputs((prev) => ({
			...prev,
			[activityId]: {
				...prev[activityId],
				[field]: value,
			},
		}));
	};

	// Submit rating and comment for a specific activity
	const handleSubmitRating = async (activityId) => {
		const token = localStorage.getItem('token');

		if (!token) {
			alert('You need to log in to submit a rating.');
			return;
		}

		const { rating, comment } = activityInputs[activityId] || {};

		if (!rating || !comment) {
			alert('Please provide both a rating and a comment.');
			return;
		}

		try {
			await axios.post(
				'http://localhost:3000/activities/add/rate/comment',
				{
					activityId,
					rating,
					comment,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Include the token in the request headers
					},
				}
			);

			setActivityInputs((prev) => ({
				...prev,
				[activityId]: { rating: 0, comment: '' }, // Reset after submission
			}));

			alert('Rating and comment added successfully!');
		} catch (error) {
			console.error('Error submitting rating:', error.message);
			alert('Failed to submit rating');
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold text-center mb-6'>
				Completed Activities
			</h1>
			{error && <p className='text-red-500 text-center'>{error}</p>}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{activities.length > 0 ? (
					activities.map((activity) => {
						const { rating = 0, comment = '' } =
							activityInputs[activity._id] || {};
						return (
							<div
								key={activity._id}
								className='bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300'>
								<h3 className='text-xl font-semibold mb-2'>{activity.name}</h3>
								<p className='text-gray-600'>
									Advertiser: {activity.advertiserId?.username || 'N/A'}
								</p>
								<p className='text-gray-600'>
									Date: {new Date(activity.date).toLocaleDateString()}
								</p>

								<div className='mt-4'>
									<h4 className='font-semibold'>Rate & Comment:</h4>
									<input
										type='number'
										min='1'
										max='5'
										value={rating}
										onChange={(e) =>
											handleInputChange(activity._id, 'rating', e.target.value)
										}
										className='border p-2 w-24 mt-2'
										placeholder='Rating (1-5)'
									/>
									<textarea
										value={comment}
										onChange={(e) =>
											handleInputChange(activity._id, 'comment', e.target.value)
										}
										className='border p-2 mt-2 w-full'
										placeholder='Leave a comment'
									/>
									<button
										onClick={() => handleSubmitRating(activity._id)}
										className='bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600 transition-colors duration-200'>
										Submit
									</button>
								</div>

								{activity.ratings?.length > 0 && (
									<div className='mt-4'>
										<h4 className='font-semibold'>Comments & Ratings:</h4>
										{activity.ratings.map((ratingData, index) => (
											<div
												key={index}
												className='mb-2'>
												<p className='font-medium'>
													{ratingData.userId || 'Anonymous'}
													{/* Display username or 'Anonymous' if no username */}
												</p>
												<p>{ratingData.rating} Stars</p>
												<p className='italic'>{ratingData.comment}</p>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})
				) : (
					<p className='text-center text-gray-500'>
						No completed activities found.
					</p>
				)}
			</div>
		</div>
	);
};

export default ActivityList;
