/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TouristItineraryNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Fetch the notifications on component mount
		const fetchNotifications = async () => {
			try {
				const token = localStorage.getItem('token'); // Get token from localStorage

				// Make API call to fetch itinerary notifications
				const response = await axios.get(
					'http://localhost:3000/tourists/itinerary-notification',
					{
						headers: {
							Authorization: `Bearer ${token}`, // Attach token in the Authorization header
						},
					}
				);

				// Set the notifications state
				setNotifications(response.data.notifications);
			} catch (err) {
				console.error('Error fetching notifications:', err);
				setError('Failed to load notifications');
			} finally {
				setLoading(false); // Stop loading when done
			}
		};

		fetchNotifications();
	}, []);

	if (loading) {
		return (
			<div className='w-full h-screen flex justify-center items-center'>
				<div className='text-xl font-semibold text-gray-600'>
					Loading notifications...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='w-full h-screen flex justify-center items-center'>
				<div className='text-xl font-semibold text-red-600'>{error}</div>
			</div>
		);
	}

	return (
		<div className='max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg'>
			<h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
				Tourist Itinerary Notifications
			</h2>
			{notifications.length === 0 ? (
				<p className='text-gray-600 text-xl text-center'>
					No notifications yet.
				</p>
			) : (
				<ul className='space-y-6'>
					{notifications.map((notification) => (
						<li
							key={notification._id}
							className='p-6 bg-gray-100 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 ease-in-out'>
							<div className='flex items-center justify-between'>
								<strong className='text-gray-800 text-lg font-medium'>
									{notification.message}
								</strong>
								<small className='text-gray-500 ml-4 text-sm'>
									{new Date(notification.timestamp).toLocaleString()}
								</small>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TouristItineraryNotifications;
