/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductRevenue = () => {
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
			const endpoint = 'http://localhost:3000/products/revenue';
			const response = await axios.get(endpoint);
			setRevenue(response.data); // Assuming response.data contains the revenue data
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch revenue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 flex justify-center items-center p-4'>
			<div className='p-8 w-full max-w-5xl bg-white rounded-xl shadow-2xl space-y-8'>
				<h2 className='text-4xl font-bold text-center text-gray-800'>
					Seller Revenue Dashboard
				</h2>

				{/* Error Message */}
				{error && (
					<div className='bg-red-100 text-red-700 border border-red-400 p-4 rounded-md mb-6'>
						<p className='text-center font-medium'>{error}</p>
					</div>
				)}

				{/* Loading State */}
				{loading && (
					<div className='flex justify-center items-center h-24'>
						<svg
							className='animate-spin h-8 w-8 text-blue-600 mr-4'
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
						<p className='text-xl text-blue-600 font-medium'>Loading...</p>
					</div>
				)}

				{/* Revenue Details */}
				{revenue && !loading && (
					<div>
						{/* Total Revenue */}
						<div className='p-8 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-lg mb-12 transform hover:scale-105 transition duration-200'>
							<h3 className='text-2xl font-semibold text-center text-white mb-4'>
								Total Revenue
							</h3>
							<p className='text-4xl font-bold text-center text-gray-800'>
								${revenue.totalRevenue.toLocaleString()}
							</p>
						</div>

						{/* Attractions Overview */}
						<h4 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
							Seller Overview
						</h4>
						<ul className='space-y-6'>
							{revenue.products.map((product) => (
								<li
									key={product.id}
									className='p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
									{/* Product Details */}
									<div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full'>
										<div className='flex items-center space-x-3'>
											{/* Status Icon */}
											<span>
												{product.isBooked ? (
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

											{/* Product Name */}
											<h5 className='text-lg font-semibold text-blue-600'>
												{product.name}
											</h5>
										</div>

										{/* Product Prices */}
										<div className='mt-4 sm:mt-0 grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700'>
											<p>
												<strong>Price:</strong> $
												{product.price.toLocaleString()}
											</p>
										</div>
									</div>

									{/* Revenue Details */}
									<div className='mt-4 sm:mt-0 text-sm text-gray-600'>
										<p>
											<strong>Status:</strong>{' '}
											<span
												className={`font-semibold ${
													product.isBooked ? 'text-green-600' : 'text-red-600'
												}`}>
												{product.isBooked ? 'Booked' : 'Not Booked'}
											</span>
										</p>
										<p className='mt-2'>
											<strong>Revenue:</strong>{' '}
											<span className='text-blue-700'>
												${product.revenue.toLocaleString()}
											</span>
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Refresh Button */}
				<div className='flex justify-center mt-8'>
					<button
						onClick={fetchRevenue}
						className={`px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
							loading ? 'cursor-not-allowed opacity-50' : ''
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

export default ProductRevenue;
