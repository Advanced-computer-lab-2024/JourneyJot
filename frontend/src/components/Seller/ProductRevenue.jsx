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
		<div className='min-h-screen bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 flex justify-center items-center'>
			<div className='p-8 w-full max-w-4xl bg-white rounded-xl shadow-2xl'>
				<h2 className='text-3xl font-bold text-center text-gray-800 mb-8'>
					Seller Revenue Dashboard
				</h2>

				{/* Show loading state */}
				{loading && (
					<div className='flex justify-center items-center h-24'>
						<p className='text-xl text-blue-600'>Loading...</p>
					</div>
				)}

				{/* Show error message */}
				{error && (
					<div className='bg-red-100 text-red-700 border border-red-400 p-4 rounded-md mb-8'>
						<p>{error}</p>
					</div>
				)}

				{/* Show total revenue and activity details */}
				{revenue && (
					<div>
						{/* Display total revenue */}
						<div className='p-8 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-lg mb-12'>
							<h3 className='text-2xl font-semibold text-center text-white mb-4'>
								Total Revenue
							</h3>
							<p className='text-3xl font-bold text-center text-white'>
								${revenue.totalRevenue}
							</p>
						</div>

						{/* Display activity details */}
						<h4 className='text-xl font-semibold text-gray-800 mb-6 text-center'>
							Seller Overview
						</h4>
						<ul className='space-y-6'>
							{revenue.products.map((product) => (
								<li
									key={product.id}
									className='p-6 bg-white rounded-xl shadow-md flex flex-col space-y-4'>
									<h5 className='text-xl font-semibold text-blue-600'>
										{product.name}
									</h5>
									<div className='flex justify-between'>
										<p>
											<strong>Price:</strong> ${product.price}
										</p>
										<p>
											<strong>Status:</strong>{' '}
											<span
												className={`${
													product.isBooked ? 'text-green-600' : 'text-red-600'
												}`}>
												{product.isBooked ? 'Booked' : 'Not Booked'}
											</span>
										</p>
									</div>
									<p>
										<strong>Revenue:</strong> ${product.revenue}
									</p>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Button to manually refresh data */}
				<div className='flex justify-center mt-8'>
					<button
						onClick={fetchRevenue}
						className={`px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							loading ? 'cursor-not-allowed opacity-50' : ''
						}`}
						disabled={loading}>
						{loading ? 'Fetching...' : 'Refresh Revenue Data'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductRevenue;
