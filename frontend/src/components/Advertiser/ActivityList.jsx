/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityList = () => {
	const [activities, setActivities] = useState([]);
	const [error, setError] = useState(null);
	const [activityInputs, setActivityInputs] = useState({});
	const [visibleDetails, setVisibleDetails] = useState({}); // State to track visibility of details for each activity

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

	// Toggle visibility of activity details
	const toggleDetails = (activityId) => {
		setVisibleDetails((prev) => ({
			...prev,
			[activityId]: !prev[activityId],
		}));
	};

	return (
		<div className='container mx-auto gap-x-10 py-8'>
			<h1 className='text-4xl font-extrabold text-center mb-12 text-gray-800'>
				Completed Activities
			</h1>
			{error && <p className='text-red-500 text-center'>{error}</p>}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
				{activities.length > 0 ? (
					activities.map((activity) => {
						const { rating = 0, comment = '' } =
							activityInputs[activity._id] || {};
						const isDetailsVisible = visibleDetails[activity._id]; // Check if details are visible for this activity
						return (
							<div
								key={activity._id}
								className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105'>
								<h3 className='text-2xl font-semibold mb-2 text-gray-900'>
									{activity.name}
								</h3>
								<p className='text-gray-600'>
									Advertiser: {activity.advertiserId?.username || 'N/A'}
								</p>
								<p className='text-gray-600'>
									Date: {new Date(activity.date).toLocaleDateString()}
								</p>

								{/* Button to toggle details visibility */}
								<button
									onClick={() => toggleDetails(activity._id)}
									className='bg-blue-600 text-white px-5 py-2 mt-4 rounded-lg hover:bg-blue-700 transition-colors duration-300'>
									{isDetailsVisible ? 'Hide Details' : 'View Details'}
								</button>

								{/* Conditionally render activity details */}
								{isDetailsVisible && (
									<div className='mt-4 space-y-2'>
										<p className='text-gray-600'>
											Category: {activity.category?.name || 'N/A'}
										</p>
										<p className='text-gray-600'>
											PreferenceTag: {activity.preferenceTag?.name || 'N/A'}
										</p>
										<p className='text-gray-600'>
											PriceRange: {activity.priceRange || 'N/A'}
										</p>

										{/* Rating and comment form */}
										<div className='mt-6 space-y-4'>
											<h4 className='font-semibold text-gray-700'>
												Rate & Comment:
											</h4>
											<input
												type='number'
												min='1'
												max='5'
												value={rating}
												onChange={(e) =>
													handleInputChange(
														activity._id,
														'rating',
														e.target.value
													)
												}
												className='border p-3 w-full sm:w-28 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
												placeholder='Rating (1-5)'
											/>
											<textarea
												value={comment}
												onChange={(e) =>
													handleInputChange(
														activity._id,
														'comment',
														e.target.value
													)
												}
												className='border p-3 mt-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
												placeholder='Leave a comment'
											/>
											<button
												onClick={() => handleSubmitRating(activity._id)}
												className='bg-blue-600 text-white px-5 py-2 mt-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full'>
												Submit
											</button>
										</div>

										{/* Display existing ratings and comments */}
										{activity.ratings?.length > 0 && (
											<div className='mt-6 space-y-4'>
												<h4 className='font-semibold text-gray-700'>
													Comments & Ratings:
												</h4>
												{activity.ratings.map((ratingData, index) => (
													<div
														key={index}
														className='flex items-start space-x-6 border-b pb-4 mb-4 last:mb-0'>
														{/* Tourist Name */}
														<div className='flex-shrink-0'>
															<p className='font-semibold text-gray-800'>
																<span className='text-blue-600'>Tourist:</span>{' '}
																{ratingData.userId?.username || 'Anonymous'}
															</p>
														</div>

														{/* Stars */}
														<div className='flex items-center space-x-1'>
															<span className='font-medium text-gray-600'>
																Rating:
															</span>
															{[...Array(ratingData.rating)].map((_, i) => (
																<svg
																	key={i}
																	xmlns='http://www.w3.org/2000/svg'
																	width='16'
																	height='16'
																	fill='currentColor'
																	className='text-yellow-500'>
																	<path d='M8 .25a7.75 7.75 0 0 1 7.75 7.75c0 3.3-2.163 5.8-4.2 6.75a1 1 0 0 0-.5.75l.5 2.5-2.75-1.25-2.75 1.25.5-2.5a1 1 0 0 0-.5-.75C2.413 13.8.25 11.3.25 8a7.75 7.75 0 0 1 7.75-7.75z' />
																</svg>
															))}
															{[...Array(5 - ratingData.rating)].map((_, i) => (
																<svg
																	key={i}
																	xmlns='http://www.w3.org/2000/svg'
																	width='16'
																	height='16'
																	fill='currentColor'
																	className='text-gray-400'>
																	<path d='M8 .25a7.75 7.75 0 0 1 7.75 7.75c0 3.3-2.163 5.8-4.2 6.75a1 1 0 0 0-.5.75l.5 2.5-2.75-1.25-2.75 1.25.5-2.5a1 1 0 0 0-.5-.75C2.413 13.8.25 11.3.25 8a7.75 7.75 0 0 1 7.75-7.75z' />
																</svg>
															))}
														</div>

														{/* Comment */}
														<p className='text-gray-600'>
															{ratingData.comment}
														</p>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						);
					})
				) : (
					<p className='text-center text-gray-500'>
						No activities available to display.
					</p>
				)}
			</div>
		</div>
	);
};

export default ActivityList;
