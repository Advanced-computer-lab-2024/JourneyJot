/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AttractionRevenue = () => {
	const [revenue, setRevenue] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
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
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center p-4'>
			<div className='p-6 max-w-5xl w-full bg-white rounded-lg shadow-md space-y-8'>
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
				<h2 className='text-center text-4xl font-semibold text-indigo-700'>
					Attraction Revenue Dashboard
				</h2>

				{/* Error Message */}
				{error && (
					<div className='p-4 bg-red-50 text-red-600 border border-red-200 rounded-md mb-6'>
						<p className='text-center font-medium'>{error}</p>
					</div>
				)}

				{/* Loading State */}
				{loading && (
					<div className='flex justify-center items-center h-24'>
						<svg
							className='animate-spin h-8 w-8 text-blue-500 mr-4'
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
						<p className='text-xl text-blue-500 font-medium'>Loading...</p>
					</div>
				)}

				{/* Revenue Details */}
				{revenue && !loading && (
					<div>
						{/* Total Revenue */}
						<div className='p-6 bg-blue-100 rounded-md shadow-sm mb-6 transform hover:scale-105 transition duration-200'>
							<h3 className='text-center text-2xl font-semibold text-indigo-700'>
								Total Revenue
							</h3>
							<p className='text-center text-3xl font-bold text-gray-800 mt-2'>
								${revenue.totalRevenue.toLocaleString()}
							</p>
						</div>

						{/* Attractions Overview */}
						<h4 className='text-center text-gray-700 text-2xl font-semibold mb-4'>
							Attractions Overview
						</h4>
						<ul className='space-y-4'>
							{revenue.attractions.map((attraction) => (
								<li
									key={attraction.id}
									className='p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
									{/* Attraction Details */}
									<div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full'>
										<div className='flex flex-col sm:flex-row sm:items-center sm:space-x-2'>
											{/* Status Icon */}
											<span>
												{attraction.isBooked ? (
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

											{/* Attraction Name */}
											<h5 className='text-lg font-semibold text-indigo-600'>
												{attraction.name}
											</h5>
										</div>

										{/* Attraction Prices */}
										<div className='mt-2 sm:mt-0 grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700'>
											<p>
												<strong>Price (Native):</strong> $
												{attraction.ticketPrices.native.toLocaleString()}
											</p>
											<p>
												<strong>Price (Foreigner):</strong> $
												{attraction.ticketPrices.foreigner.toLocaleString()}
											</p>
											<p>
												<strong>Price (Student):</strong> $
												{attraction.ticketPrices.student.toLocaleString()}
											</p>
										</div>
									</div>

									{/* Revenue Details */}
									<div className='mt-4 sm:mt-0 text-sm text-gray-600'>
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
												${attraction.revenue.toLocaleString()}
											</span>
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Refresh Button */}
				<div className='text-center mt-8'>
					<button
						onClick={fetchRevenue}
						className={`px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-medium shadow-sm transition ${
							loading
								? 'opacity-50 cursor-not-allowed'
								: 'hover:bg-blue-600 active:bg-blue-700'
						}`}
						disabled={loading}>
						{loading ? (
							<>
								<svg
									className='animate-spin h-5 w-5 mr-2 inline-block text-white'
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
			</div>
		</div>
	);
};

export default AttractionRevenue;
