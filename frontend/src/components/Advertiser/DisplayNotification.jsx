/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineWarning } from 'react-icons/ai'; // Using a warning icon

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
		<div className='min-h-screen bg-gray-100 p-4'>
			<div className='bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
					Activity Report
				</h1>

				{/* Loading and error handling */}
				{loading ? (
					<p className='text-center text-blue-500'>Loading...</p>
				) : error ? (
					<p className='text-center text-red-500'>{error}</p>
				) : (
					<>
						{/* Flagged Activities Notification */}
						{flaggedActivities.length > 0 && (
							<div className='notification-banner animate__animated animate__fadeIn mb-6'>
								<div className='bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
									<AiOutlineWarning className='text-xl' />
									<div>
										<p className='font-semibold'>
											Alert: Some activities are flagged!
										</p>
										<ul className='list-disc list-inside'>
											{flaggedActivities.map((activity) => (
												<li key={activity._id}>{activity.name} - Flagged</li>
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
						<ul className='space-y-4'>
							{activities.map((activity) => (
								<li
									key={activity._id}
									className={`p-4 border rounded ${
										activity.flagged ? 'border-red-500' : 'border-gray-300'
									}`}>
									<p className='text-lg font-medium'>{activity.name}</p>
									<p className='text-sm text-gray-500'>
										{activity.flagged ? 'Status: Flagged' : 'Status: Active'}
									</p>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</div>
	);
};

export default DisplayNotification;
