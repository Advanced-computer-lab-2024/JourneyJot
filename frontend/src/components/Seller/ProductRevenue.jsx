/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductRevenue = () => {
	const [revenue, setRevenue] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [filteredProducts, setFilteredProducts] = useState([]);

	// Fetch revenue data when the component mounts
	useEffect(() => {
		fetchRevenue();
	}, []);

	useEffect(() => {
		if (revenue) {
			applyDateFilter();
		}
	}, [startDate, endDate, revenue]);

	const fetchRevenue = async () => {
		setLoading(true);
		setError('');
		setRevenue(null);

		try {
			const endpoint = 'http://localhost:3000/products/revenue';
			const response = await axios.get(endpoint);
			setRevenue(response.data); // Assuming response.data contains the revenue data
			setFilteredProducts(response.data.products); // Set initial filtered products
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch revenue');
		} finally {
			setLoading(false);
		}
	};

	const applyDateFilter = () => {
		if (!startDate && !endDate) {
			setFilteredProducts(revenue.products);
			return;
		}

		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;

		const filtered = revenue.products.filter((product) => {
			const productDate = new Date(product.date); // Assuming `product.date` exists in ISO format
			if (start && productDate < start) return false;
			if (end && productDate > end) return false;
			return true;
		});

		setFilteredProducts(filtered);
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

				{/* Date Filter */}
				<div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8'>
					<div>
						<label className='block text-gray-600 font-medium mb-1'>
							Start Date
						</label>
						<input
							type='date'
							className='w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</div>
					<div>
						<label className='block text-gray-600 font-medium mb-1'>
							End Date
						</label>
						<input
							type='date'
							className='w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
						/>
					</div>
				</div>

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
				{!loading && filteredProducts.length > 0 && (
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

						{/* Products Overview */}
						<h4 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
							Seller Overview
						</h4>
						<ul className='space-y-6'>
							{filteredProducts.map((product) => (
								<li
									key={product.id}
									className='p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
									{/* Product Details */}
									<div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full'>
										<div className='flex items-center space-x-3'>
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
											<strong>Revenue:</strong>{' '}
											<span className='text-blue-700'>
												${product.revenue.toLocaleString()}
											</span>
										</p>
										<p>
											<strong>Date:</strong> {product.date}
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* No Results */}
				{!loading && filteredProducts.length === 0 && (
					<p className='text-center text-gray-600'>
						No products match the selected date range.
					</p>
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
