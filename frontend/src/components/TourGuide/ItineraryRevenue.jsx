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
		<div className='p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg'>
			<h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>
				Itinerary Revenue Dashboard
			</h2>

			{/* Loading state */}
			{loading && (
				<div className='flex justify-center items-center h-24'>
					<p className='text-lg text-blue-500'>Loading...</p>
				</div>
			)}

			{/* Error message */}
			{error && (
				<div className='p-4 bg-red-100 text-red-700 rounded-md mb-4'>
					<p>{error}</p>
				</div>
			)}

			{/* Date input and filter button */}
			<div className='flex items-center space-x-4 mb-6'>
				<div className='flex-1'>
					<label
						htmlFor='date'
						className='block text-sm font-medium text-gray-700'>
						Date
					</label>
					<input
						id='date'
						type='date'
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className='w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none'
					/>
				</div>
				<button
					onClick={fetchRevenue}
					className='bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-300'>
					Filter
				</button>
			</div>

			{/* Revenue details */}
			{revenue && (
				<div>
					{/* Total revenue */}
					<div className='p-4 bg-blue-50 rounded-lg shadow-md mb-6'>
						<h3 className='text-center text-xl font-semibold text-blue-700'>
							Total Revenue
						</h3>
						<p className='text-center text-2xl font-bold mt-2'>
							${revenue.totalRevenue}
						</p>
					</div>

					{/* Itinerary details */}
					<h4 className='text-lg font-semibold text-gray-800 mb-4 text-center'>
						Itinerary Revenue Overview
					</h4>
					<ul className='space-y-4'>
						{revenue.itineraries.map((itinerary) => (
							<li
								key={itinerary.id}
								className='p-4 bg-white rounded-lg shadow-md border border-gray-200'>
								<h5 className='text-lg font-semibold text-blue-600'>
									{itinerary.name?.username}
								</h5>
								<div className='flex justify-between mt-2 text-sm text-gray-700'>
									<p>
										<strong>Price:</strong> ${itinerary.price}
									</p>
									<p>
										<strong>Status:</strong>{' '}
										<span
											className={`font-bold ${
												itinerary.isBooked ? 'text-green-600' : 'text-red-600'
											}`}>
											{itinerary.isBooked ? 'Booked' : 'Not Booked'}
										</span>
									</p>
								</div>
								<p className='mt-2 text-sm text-gray-700'>
									<strong>Revenue:</strong> ${itinerary.revenue}
								</p>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Refresh button */}
			<div className='text-center mt-6'>
				<button
					onClick={fetchRevenue}
					className='px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-300'
					disabled={loading}>
					{loading ? 'Fetching...' : 'Refresh Revenue Data'}
				</button>
			</div>
		</div>
	);
};

export default ItineraryRevenue;
