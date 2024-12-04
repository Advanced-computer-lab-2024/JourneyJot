/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItineraryRevenue = () => {
	const [revenue, setRevenue] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [date, setDate] = useState('');

	// Fetch revenue data when the component mounts
	useEffect(() => {
		fetchRevenue();
	}, []);

	const fetchRevenue = async () => {
		setLoading(true);
		setError('');
		setRevenue(null);

		try {
			const endpoint = 'http://localhost:3000/itineraries/revenue';
			const response = await axios.get(endpoint, {
				params: { date },
			});
			setRevenue(response.data); // Assuming response.data contains the revenue data
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch revenue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-8 flex items-center justify-center'>
			<div className='p-8 max-w-4xl w-full bg-white rounded-xl shadow-lg'>
				<h2 className='text-center text-3xl font-bold text-indigo-700 mb-8'>
					Itinerary Revenue Dashboard
				</h2>

				{/* Error message */}
				{error && (
					<div className='p-4 mb-6 text-sm bg-red-100 text-red-700 rounded-md'>
						{error}
					</div>
				)}

				{/* Date input */}
				<div className='flex flex-col sm:flex-row items-center gap-4 mb-8'>
					<div className='w-full sm:w-auto'>
						<label
							htmlFor='date'
							className='block text-gray-700 font-medium text-sm mb-2'>
							Select Date
						</label>
						<input
							id='date'
							type='date'
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none'
						/>
					</div>
					<button
						onClick={fetchRevenue}
						className='bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400'>
						Filter
					</button>
				</div>

				{/* Loading state */}
				{loading && (
					<div className='text-center'>
						<p className='text-lg text-indigo-500'>Fetching data...</p>
					</div>
				)}

				{/* Revenue details */}
				{revenue && !loading && (
					<div>
						{/* Total revenue */}
						<div className='mb-8'>
							<div className='bg-blue-50 p-6 rounded-lg shadow-md'>
								<h3 className='text-center text-2xl font-semibold text-indigo-700'>
									Total Revenue
								</h3>
								<p className='text-center text-3xl font-bold text-gray-800 mt-2'>
									${revenue.totalRevenue}
								</p>
							</div>
						</div>

						{/* Itinerary details */}
						<h4 className='text-lg font-semibold text-gray-800 mb-4 text-center'>
							Itinerary Breakdown
						</h4>
						<ul className='space-y-4'>
							{revenue.itineraries.map((itinerary) => (
								<li
									key={itinerary.id}
									className='p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200'>
									<div className='flex justify-between items-center'>
										<h5 className='text-lg font-bold text-indigo-700'>
											{itinerary.name?.username}
										</h5>
										<span
											className={`px-3 py-1 rounded-lg text-sm font-medium ${
												itinerary.isBooked
													? 'bg-green-100 text-green-700'
													: 'bg-red-100 text-red-700'
											}`}>
											{itinerary.isBooked ? 'Booked' : 'Not Booked'}
										</span>
									</div>
									<div className='mt-2 text-sm text-gray-600'>
										<p>
											<strong>Price:</strong> ${itinerary.price}
										</p>
										<p>
											<strong>Revenue:</strong> ${itinerary.revenue}
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Refresh button */}
				<div className='text-center mt-8'>
					<button
						onClick={fetchRevenue}
						className='px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400'
						disabled={loading}>
						{loading ? 'Fetching...' : 'Refresh Revenue Data'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ItineraryRevenue;
