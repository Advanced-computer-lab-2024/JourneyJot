/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttractionRevenue = () => {
	const [revenue, setRevenue] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Fetch revenue data when the component mounts
	useEffect(() => {
		fetchRevenue();
	}, []);

	const fetchRevenue = async () => {
		setLoading(true);
		setError('');
		setRevenue(null);

		try {
			const endpoint = 'http://localhost:3000/attractions/revenue';
			const response = await axios.get(endpoint);
			setRevenue(response.data); // Assuming response.data contains the revenue data
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch revenue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md'>
				<h2 className='text-center text-gray-900 text-4xl font-semibold mb-6'>
					Attraction Revenue Dashboard
				</h2>

				{/* Show loading state */}
				{loading && (
					<div className='flex justify-center items-center h-24'>
						<p className='text-xl text-blue-500 font-medium'>Loading...</p>
					</div>
				)}

				{/* Show error message */}
				{error && (
					<div className='p-4 bg-red-50 text-red-600 border border-red-200 rounded-md mb-6'>
						<p className='text-center font-medium'>{error}</p>
					</div>
				)}

				{/* Show total revenue and attraction details */}
				{revenue && (
					<div>
						{/* Display total revenue */}
						<div className='p-6 bg-blue-100 rounded-md shadow-sm mb-6'>
							<h3 className='text-center text-blue-700 text-2xl font-semibold'>
								Total Revenue
							</h3>
							<p className='text-center text-3xl font-bold text-gray-800 mt-2'>
								${revenue.totalRevenue}
							</p>
						</div>

						{/* Display attractions with revenue */}
						<h4 className='text-center text-gray-700 text-2xl font-semibold mb-4'>
							Attractions Overview
						</h4>
						<ul className='space-y-4'>
							{revenue.attractions.map((attraction) => (
								<li
									key={attraction.id}
									className='p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm'>
									<h5 className='text-lg font-semibold text-blue-600'>
										{attraction.name}
									</h5>
									<div className='grid grid-cols-3 gap-4 mt-4 text-gray-700'>
										<p>
											<strong>Price (Native):</strong> $
											{attraction.ticketPrices.native}
										</p>
										<p>
											<strong>Price (Foreigner):</strong> $
											{attraction.ticketPrices.foreigner}
										</p>
										<p>
											<strong>Price (Student):</strong> $
											{attraction.ticketPrices.student}
										</p>
									</div>
									<div className='mt-4'>
										<p>
											<strong>Status:</strong>{' '}
											<span
												className={`font-semibold ${
													attraction.isBooked
														? 'text-green-500'
														: 'text-red-500'
												}`}>
												{attraction.isBooked ? 'Booked' : 'Not Booked'}
											</span>
										</p>
										<p className='mt-2'>
											<strong>Revenue:</strong>{' '}
											<span className='text-blue-700'>
												${attraction.revenue}
											</span>
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Button to manually refresh data */}
				<div className='text-center mt-8'>
					<button
						onClick={fetchRevenue}
						className={`px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-medium shadow-sm transition ${
							loading
								? 'opacity-50 cursor-not-allowed'
								: 'hover:bg-blue-600 active:bg-blue-700'
						}`}
						disabled={loading}>
						{loading ? 'Fetching...' : 'Refresh Revenue Data'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AttractionRevenue;
