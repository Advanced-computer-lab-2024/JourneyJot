/** @format */

import React, { useState, useEffect } from 'react';

const NetworkNotification = () => {
	const [isOnline, setIsOnline] = useState(false);
	const [showOnlineMessage, setShowOnlineMessage] = useState(false);

	// Function to manually check connectivity
	const checkConnectivity = async () => {
		try {
			// Attempt to fetch a reliable resource (Google favicon)
			const response = await fetch('https://www.google.com/favicon.ico', {
				mode: 'no-cors',
			});
			if (response) {
				setIsOnline(true);
			}
		} catch (error) {
			setIsOnline(false);
		}
	};

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
			setShowOnlineMessage(true);
			setTimeout(() => setShowOnlineMessage(false), 3000);
		};

		const handleOffline = () => setIsOnline(false);

		// Perform an initial connectivity check
		checkConnectivity();

		// Add event listeners for online/offline events
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	return (
		<>
			{/* Offline Notification */}
			{!isOnline && (
				<div className='fixed bottom-0 left-0 right-0 bg-red-600 text-white text-lg font-semibold py-4 px-6 z-50 shadow-lg'>
					<span>You are offline!</span>
				</div>
			)}

			{/* Online Notification */}
			{showOnlineMessage && (
				<div className='fixed top-4 right-4 bg-green-500 text-white text-lg font-semibold py-3 px-5 rounded-lg shadow-lg'>
					<span>You are back online!</span>
				</div>
			)}
		</>
	);
};

export default NetworkNotification;
