/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TouristNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// Fetch notifications when the component mounts
	useEffect(() => {
		const authToken = localStorage.getItem('token');
		if (!authToken) {
			setError('Authentication token not found.');
			setLoading(false);
			return;
		}

		axios
			.get('http://localhost:3000/tourists/activity-notification', {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			})
			.then((response) => {
				setNotifications(response.data.notifications);
				setLoading(false);
			})
			.catch((err) => {
				setError('Failed to fetch notifications');
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<p className='text-gray-600 text-xl'>Loading notifications...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<p className='text-red-600 text-xl'>{error}</p>
			</div>
		);
	}

	return (
		<div className='max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl'>
			<h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
				Tourist Notifications
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
							className='p-6 bg-gray-50 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out'>
							<div className='flex items-center justify-between'>
								<strong className='text-gray-800 text-lg font-semibold'>
									{notification.message}
								</strong>
								<small className='text-gray-500 ml-4 text-sm'>
									{new Date(notification.timestamp).toLocaleString()}
								</small>
							</div>

							{/* Display additional activity details if available */}
							<div className='mt-4 space-y-3 text-gray-600'>
								{notification.activityDetails && (
									<>
										<p>
											<span className='font-semibold'>Activity:</span>{' '}
											{notification.activityDetails.name || 'N/A'}
										</p>
										<p>
											<span className='font-semibold'>Date:</span>{' '}
											{notification.activityDetails.date || 'N/A'}
										</p>
										<p>
											<span className='font-semibold'>Time:</span>{' '}
											{notification.activityDetails.time || 'N/A'}
										</p>
										<p>
											<span className='font-semibold'>Price:</span>{' '}
											{notification.activityDetails.price
												? `$${notification.activityDetails.price}`
												: 'N/A'}
										</p>
										<p>
											<span className='font-semibold'>Price Range:</span>{' '}
											{notification.activityDetails.priceRange || 'N/A'}
										</p>
										<p>
											<span className='font-semibold'>Special Discounts:</span>{' '}
											{notification.activityDetails.specialDiscounts || 'None'}
										</p>
										<p>
											<span className='font-semibold'>Booking Status:</span>{' '}
											{notification.activityDetails.bookingOpen
												? 'Open'
												: 'Closed'}
										</p>
									</>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TouristNotifications;
