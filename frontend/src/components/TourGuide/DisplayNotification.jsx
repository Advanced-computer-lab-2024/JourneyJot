/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisplayNotificationItinerary = () => {
	const [itineraries, setItineraries] = useState([]);
	const [flaggedItineraries, setFlaggedItineraries] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const API_URL = 'http://localhost:3000/tour-guides/notifications';

	const fetchItineraries = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token'); // Retrieve token from localStorage
			const response = await axios.get(API_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setItineraries(response.data.itineraries);
			setFlaggedItineraries(response.data.flaggedItineraries);
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Error fetching itineraries'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchItineraries();
	}, []);

	return (
		<div className='min-h-screen bg-gray-100 p-4'>
			<div className='bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
					Itinerary Report
				</h1>

				{loading ? (
					<p className='text-center text-blue-500'>Loading...</p>
				) : error ? (
					<p className='text-center text-red-500'>{error}</p>
				) : (
					<>
						{flaggedItineraries.length > 0 && (
							<div className='bg-red-100 text-red-700 p-4 mb-6 rounded'>
								<p className='font-semibold'>
									Alert: Some itineraries are flagged!
								</p>
								<ul className='list-disc list-inside'>
									{flaggedItineraries.map((itinerary) => (
										<li key={itinerary._id}>{itinerary.name} - Flagged</li>
									))}
								</ul>
							</div>
						)}

						<h2 className='text-xl font-semibold text-gray-700 mb-4'>
							All Itineraries
						</h2>
						<ul className='space-y-4'>
							{itineraries.map((itinerary) => (
								<li
									key={itinerary._id}
									className={`p-4 border rounded ${
										itinerary.flagged ? 'border-red-500' : 'border-gray-300'
									}`}>
									<p className='text-lg font-medium'>{itinerary.name}</p>
									<p className='text-sm text-gray-500'>
										{itinerary.flagged ? 'Status: Flagged' : 'Status: Active'}
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

export default DisplayNotificationItinerary;
