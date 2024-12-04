/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineWarning } from 'react-icons/ai';

const DisplayNotification = () => {
	const [activities, setActivities] = useState([]);
	const [flaggedActivities, setFlaggedActivities] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const API_URL = 'http://localhost:3000/advertisers/notifications';

	// Fetch activities and notifications
	const fetchActivities = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token'); // Retrieve token from localStorage
			const response = await axios.get(API_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setActivities(response.data.activities);
			setFlaggedActivities(response.data.flaggedActivities);
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Error fetching activities'
			);
		} finally {
			setLoading(false);
		}
	};

	// Trigger the fetch on component mount
	useEffect(() => {
		fetchActivities();
	}, []);

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-300 p-6 flex items-center justify-center'>
			<div className='bg-white shadow-lg rounded-lg w-full max-w-4xl p-8'>
				<h1 className='text-3xl font-bold text-gray-800 text-center mb-8'>
					Activity Notifications
				</h1>

				{/* Loading and error handling */}
				{loading ? (
					<div className='text-center text-blue-600 text-lg'>Loading...</div>
				) : error ? (
					<div className='text-center text-red-500 text-lg'>{error}</div>
				) : (
					<div>
						{/* Flagged Activities Notification */}
						{flaggedActivities.length > 0 && (
							<div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded'>
								<div className='flex items-center'>
									<AiOutlineWarning className='text-2xl mr-3' />
									<div>
										<p className='font-bold text-lg'>
											Attention Required: Flagged Activities!
										</p>
										<ul className='mt-2 list-disc list-inside text-sm'>
											{flaggedActivities.map((activity) => (
												<li
													key={activity._id}
													className='text-gray-700'>
													{activity.name} -{' '}
													<span className='text-red-600'>Flagged</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						)}

						{/* All Activities List */}
						<h2 className='text-xl font-semibold text-gray-700 mb-4'>
							All Activities
						</h2>
						<ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							{activities.map((activity) => (
								<li
									key={activity._id}
									className={`p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 ${
										activity.flagged
											? 'bg-red-50 border-l-4 border-red-500'
											: 'bg-gray-50 border-l-4 border-gray-300'
									}`}>
									<div>
										<p className='text-lg font-bold text-gray-800'>
											{activity.name}
										</p>
										<p className='text-sm text-gray-600'>
											Status: {activity.flagged ? 'Flagged' : 'Active'}
										</p>
									</div>
									{activity.flagged && (
										<div className='mt-3 text-red-600 text-sm font-medium'>
											⚠ Needs Attention
										</div>
									)}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default DisplayNotification;
