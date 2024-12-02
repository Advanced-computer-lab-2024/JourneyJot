/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookMarks = () => {
	const [savedActivities, setSavedActivities] = useState([]);
	const [savedItineraries, setSavedItineraries] = useState([]);
	const [savedAttractions, setSavedAttractions] = useState([]);
	const [activeTab, setActiveTab] = useState('activities');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch bookmarks on mount
	useEffect(() => {
		const fetchBookmarks = async () => {
			try {
				setError(null); // Reset error on fetch
				const token = localStorage.getItem('token');
				if (!token) throw new Error('No token found. Please login again.');

				const config = {
					headers: { Authorization: `Bearer ${token}` },
				};

				const response = await axios.get(
					'http://localhost:3000/tourists/bookmarks',
					config
				);

				setSavedActivities(response.data.savedActivities || []);
				setSavedItineraries(response.data.savedItineraries || []);
				setSavedAttractions(response.data.savedAttractions || []);
			} catch (err) {
				console.error('Error fetching bookmarks:', err);
				setError(err.response?.data?.message || 'Failed to load bookmarks.');
			} finally {
				setLoading(false);
			}
		};

		fetchBookmarks();
	}, []);

	// Remove a bookmark
	const removeBookmark = async (type, id) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			await axios.delete(
				`http://localhost:3000/tourists/bookmarks/${type}/${id}`,
				config
			);

			if (type === 'activities') {
				setSavedActivities((prev) => prev.filter((item) => item._id !== id));
			} else if (type === 'itineraries') {
				setSavedItineraries((prev) => prev.filter((item) => item._id !== id));
			} else if (type === 'attractions') {
				setSavedAttractions((prev) => prev.filter((item) => item._id !== id));
			}
		} catch (err) {
			console.error('Error removing bookmark:', err);
			setError(err.response?.data?.message || 'Failed to remove bookmark.');
		}
	};

	// Render tab content
	const renderTabContent = () => {
		const items =
			activeTab === 'activities'
				? savedActivities
				: activeTab === 'itineraries'
				? savedItineraries
				: savedAttractions;

		if (loading) {
			return <p className='text-center text-gray-500'>Loading...</p>;
		}

		if (items.length === 0) {
			return (
				<p className='text-gray-500'>
					No bookmarks available in this category.
				</p>
			);
		}

		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{items.map((item) => (
					<div
						key={item._id}
						className='border border-gray-300 rounded-lg shadow-md p-4 bg-white'>
						<ul className='list-disc list-inside space-y-2'>
							{activeTab === 'activities' && (
								<>
									<li className='text-gray-700'>
										<span className='font-semibold'>AdvertiserId </span>
										{item.advertiserId?.username || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Date: </span>
										{new Date(item.date).toLocaleDateString()}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Time: </span>
										{item.time}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Special Discounts: </span>
										{item.specialDiscounts || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>category </span>
										{item.category?.name || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>preferenceTag </span>
										{item.preferenceTag?.name || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Booking Status: </span>
										{item.bookingOpen ? 'Open' : 'Closed'}
									</li>
								</>
							)}
							{activeTab === 'itineraries' && (
								<>
									<li className='text-gray-700'>
										<span className='font-semibold'>TourGuide Name: </span>
										{item.tourGuideId?.name || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Timeline: </span>
										{item.timeline}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Duration: </span>
										{item.duration}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Language: </span>
										{item.language}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Accessibility: </span>
										{item.accessibility}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Pickup Location: </span>
										{item.pickupLocation}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Dropoff Locations: </span>
										{item.dropoffLocation}
									</li>
								</>
							)}
							{activeTab === 'attractions' && (
								<>
									<li className='text-gray-700'>
										<span className='font-semibold'>Governor Name: </span>
										{item.governorId?.name || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Name: </span>
										{item.name || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Description: </span>
										{item.description || 'No description available.'}
									</li>
								</>
							)}
						</ul>

						<button
							onClick={() => removeBookmark(activeTab, item._id)}
							className='mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
							Remove Bookmark
						</button>
					</div>
				))}
			</div>
		);
	};

	const tabs = {
		activities: 'Activities',
		itineraries: 'Itineraries',
		attractions: 'Attractions',
	};

	return (
		<div className='p-6 bg-gray-50 min-h-screen'>
			<h1 className='text-3xl font-bold text-blue-600 mb-6 text-center'>
				My Bookmarks
			</h1>

			{/* Tabs */}
			<div className='flex justify-center mb-6'>
				{Object.keys(tabs).map((tab) => (
					<button
						key={tab}
						onClick={() => {
							setActiveTab(tab);
							setError(null); // Reset error on tab switch
						}}
						className={`px-6 py-2 rounded-lg mx-2 text-sm font-medium ${
							activeTab === tab
								? 'bg-blue-600 text-white shadow-md'
								: 'bg-gray-200 text-gray-600 hover:bg-gray-300'
						}`}>
						{tabs[tab]}
					</button>
				))}
			</div>

			{/* Error */}
			{error && <p className='text-red-500 text-center mb-4'>{error}</p>}

			{/* Content */}
			{renderTabContent()}
		</div>
	);
};

export default BookMarks;
