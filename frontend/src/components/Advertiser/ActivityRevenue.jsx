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
		<div className='min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-300 flex items-center justify-center py-8 px-4'>
			<div className='w-full max-w-5xl bg-white rounded-lg shadow-xl p-8 space-y-8'>
				<h2 className='text-4xl font-extrabold text-center text-gray-800 mb-4 tracking-tight'>
					Activity Revenue Dashboard
				</h2>

				{/* Filter Section */}
				<div className='flex flex-col md:flex-row items-center justify-between gap-4'>
					<div className='w-full md:w-1/3'>
						<label
							htmlFor='date'
							className='block text-sm font-medium text-gray-700 mb-2'>
							Filter by Date
						</label>
						<input
							id='date'
							type='date'
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className='block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition'
						/>
					</div>
					<button
						onClick={fetchRevenue}
						className='w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
						disabled={loading}>
						{loading ? 'Filtering...' : 'Filter'}
					</button>
				</div>

				{/* Loading State */}
				{loading && (
					<div className='flex justify-center items-center h-32'>
						<p className='text-blue-600 font-medium text-xl animate-pulse'>
							Loading...
						</p>
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className='p-4 bg-red-100 text-red-700 rounded-md shadow-sm'>
						<p>{error}</p>
					</div>
				)}

				{/* Revenue Data */}
				{revenue && (
					<>
						{/* Total Revenue */}
						<div className='p-6 bg-blue-50 rounded-lg shadow-md text-center transition-transform transform hover:scale-105'>
							<h3 className='text-2xl font-bold text-blue-700 mb-2'>
								Total Revenue
							</h3>
							<p className='text-4xl font-extrabold text-gray-800'>
								${revenue.totalRevenue}
							</p>
						</div>

						{/* Chart Section */}
						<div className='bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105'>
							<h4 className='text-xl font-bold text-gray-800 mb-4 text-center'>
								Revenue by Activity
							</h4>
							<div className='overflow-x-auto'>
								{/* Insert your chart component here */}
								{/* e.g., <Bar data={chartData} options={chartOptions} /> */}
								{/** Placeholder if no chart is integrated:
						<div className="text-center text-gray-500 italic">Chart goes here</div> */}
							</div>
						</div>

						{/* Activities Overview */}
						<div className='transition-transform transform hover:scale-105'>
							<h4 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
								Activities Overview
							</h4>
							<div className='overflow-x-auto'>
								<table className='min-w-full bg-white rounded-lg shadow-md'>
									<thead>
										<tr className='bg-gray-100'>
											<th className='py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
												Advertiser Name
											</th>
											<th className='py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
												Price ($)
											</th>
											<th className='py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
												Status
											</th>
											<th className='py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
												Revenue ($)
											</th>
										</tr>
									</thead>
									<tbody className='divide-y divide-gray-200'>
										{revenue.activities.map((activity) => (
											<tr
												key={activity.id}
												className='hover:bg-gray-50 transition'>
												<td className='py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-800'>
													{activity.name?.username || 'N/A'}
												</td>
												<td className='py-4 px-6 whitespace-nowrap text-sm text-gray-700'>
													${activity.price}
												</td>
												<td className='py-4 px-6 whitespace-nowrap text-sm'>
													<span
														className={`px-3 py-1 rounded-full text-xs font-semibold ${
															activity.isBooked
																? 'bg-green-100 text-green-800'
																: 'bg-red-100 text-red-800'
														}`}>
														{activity.isBooked ? 'Booked' : 'Not Booked'}
													</span>
												</td>
												<td className='py-4 px-6 whitespace-nowrap text-sm text-gray-700'>
													${activity.revenue}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Refresh Button */}
						<div className='mt-8 text-center'>
							<button
								onClick={fetchRevenue}
								className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
									loading ? 'opacity-50 cursor-not-allowed' : ''
								}`}
								disabled={loading}>
								{loading ? 'Refreshing...' : 'Refresh Revenue Data'}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ActivityRevenue;
