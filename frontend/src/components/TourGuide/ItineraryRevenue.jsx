/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItineraryRevenue = () => {
	const [revenue, setRevenue] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [date, setDate] = useState('');
	const navigate = useNavigate();

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
		<div className='min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-300 p-8 flex items-center justify-center'>
			<div className='p-8 max-w-4xl w-full bg-white rounded-xl shadow-lg'>
				<button
					onClick={() => navigate(-1)}
					className='text-gray-700 text-xl mb-4 flex items-center hover:text-gray-900 transition'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6 mr-2'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15 19l-7-7 7-7'
						/>
					</svg>
					Back
				</button>
				<h2 className='text-center text-3xl font-bold text-indigo-700 mb-8'>
					Itinerary Revenue Dashboard
				</h2>

				{/* Error message */}
				{error && (
					<div className='p-4 mb-6 text-sm bg-red-100 text-red-700 rounded-md border border-red-200'>
						{error}
					</div>
				)}

				{/* Date input and Filter button */}
				<div className='flex flex-col sm:flex-row items-center gap-4 mb-8'>
					{/* Date Picker */}
					<div className='w-full sm:w-auto flex flex-col'>
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
							className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200'
						/>
					</div>

					{/* Filter Button */}
					<button
						onClick={fetchRevenue}
						className='w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition duration-200'>
						Filter
					</button>
				</div>

				{/* Loading state */}
				{loading && (
					<div className='flex justify-center items-center mb-6'>
						<svg
							className='animate-spin h-8 w-8 text-indigo-600'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'>
							<circle
								className='opacity-25'
								cx='12'
								cy='12'
								r='10'
								stroke='currentColor'
								strokeWidth='4'></circle>
							<path
								className='opacity-75'
								fill='currentColor'
								d='M4 12a8 8 0 018-8v8H4z'></path>
						</svg>
						<p className='ml-4 text-lg text-indigo-500'>Fetching data...</p>
					</div>
				)}

				{/* Revenue details */}
				{revenue && !loading && (
					<div>
						{/* Total Revenue */}
						<div className='mb-8'>
							<div className='bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 transform hover:scale-105 transition duration-200'>
								<h3 className='text-center text-2xl font-semibold text-indigo-700'>
									Total Revenue
								</h3>
								<p className='text-center text-3xl font-bold text-gray-800 mt-2'>
									${revenue.totalRevenue}
								</p>
							</div>
						</div>

						{/* Itinerary Breakdown */}
						<h4 className='text-lg font-semibold text-gray-800 mb-4 text-center'>
							Itinerary Breakdown
						</h4>
						<ul className='space-y-4'>
							{revenue.itineraries.map((itinerary) => (
								<li
									key={itinerary.id}
									className='p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
									<div className='flex items-center space-x-3'>
										{/* Status Icon */}
										<span>
											{itinerary.isBooked ? (
												<svg
													className='h-6 w-6 text-green-500'
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
											) : (
												<svg
													className='h-6 w-6 text-red-500'
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M6 18L18 6M6 6l12 12'
													/>
												</svg>
											)}
										</span>

										{/* Itinerary Name */}
										<h5 className='text-lg font-bold text-indigo-700'>
											{itinerary.name?.username || 'N/A'}
										</h5>
									</div>

									{/* Itinerary Details */}
									<div className='mt-2 sm:mt-0 text-sm text-gray-600'>
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
				{revenue && (
					<div className='text-center mt-8'>
						<button
							onClick={fetchRevenue}
							className={`px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition duration-200 ${
								loading ? 'opacity-50 cursor-not-allowed' : ''
							}`}
							disabled={loading}>
							{loading ? (
								<>
									<svg
										className='animate-spin h-5 w-5 mr-3 inline-block text-white'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'></circle>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8v8H4z'></path>
									</svg>
									Fetching...
								</>
							) : (
								'Refresh Revenue Data'
							)}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ItineraryRevenue;
