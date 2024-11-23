/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActivityRevenue = () => {
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
			const endpoint = 'http://localhost:3000/activities/revenue';
			const response = await axios.get(endpoint, {
				params: {
					date,
				},
			});
			setRevenue(response.data); // Assuming response.data contains the revenue data
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch revenue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
				Activity Revenue Dashboard
			</h2>

			{/* Show loading state */}
			{loading && (
				<div className='flex justify-center items-center h-16'>
					<p className='text-blue-600 font-medium'>Loading...</p>
				</div>
			)}

			{/* Show error message */}
			{error && (
				<div className='p-4 bg-red-100 text-red-700 rounded-md mb-6'>
					<p>{error}</p>
				</div>
			)}

			{/* Filter by date */}
			<div className='mb-6'>
				<label
					htmlFor='date'
					className='block text-sm font-medium text-gray-700'>
					Filter by Date
				</label>
				<input
					id='date'
					type='date'
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className='mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
				/>
			</div>
			<button
				onClick={fetchRevenue}
				className='w-full bg-blue-600 text-white font-medium py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
				Filter
			</button>

			{/* Show total revenue and activity details */}
			{revenue && (
				<div className='mt-8'>
					{/* Display total revenue */}
					<div className='p-4 bg-blue-50 rounded-lg shadow-md mb-6 text-center'>
						<h3 className='text-lg font-medium text-blue-700'>Total Revenue</h3>
						<p className='text-2xl font-bold text-gray-800'>
							${revenue.totalRevenue}
						</p>
					</div>

					{/* Display activity details */}
					<h4 className='text-xl font-medium text-gray-800 mb-4 text-center'>
						Activities Overview
					</h4>
					<ul className='divide-y divide-gray-200'>
						{revenue.activities.map((activity) => (
							<li
								key={activity.id}
								className='p-4 bg-white rounded-md shadow-sm mb-4'>
								<h5 className='text-lg font-medium text-blue-600'>
									{activity.name?.username}
								</h5>
								<div className='flex justify-between mt-2 text-sm'>
									<p>
										<span className='font-medium'>Price:</span> $
										{activity.price}
									</p>
									<p>
										<span className='font-medium'>Status:</span>{' '}
										<span
											className={`${
												activity.isBooked
													? 'text-green-600 font-semibold'
													: 'text-red-600 font-semibold'
											}`}>
											{activity.isBooked ? 'Booked' : 'Not Booked'}
										</span>
									</p>
								</div>
								<p className='mt-2 text-sm'>
									<span className='font-medium'>Revenue:</span> $
									{activity.revenue}
								</p>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Button to manually refresh data */}
			<div className='mt-8 text-center'>
				<button
					onClick={fetchRevenue}
					className='px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
					disabled={loading}>
					{loading ? 'Fetching...' : 'Refresh Revenue Data'}
				</button>
			</div>
		</div>
	);
};

export default ActivityRevenue;
