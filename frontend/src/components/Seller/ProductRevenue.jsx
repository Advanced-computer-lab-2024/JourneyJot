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
		<div className='p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg'>
			<h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
				Seller Revenue Dashboard
			</h2>

			{/* Show loading state */}
			{loading && (
				<div className='flex justify-center items-center h-24'>
					<p className='text-lg text-blue-600'>Loading...</p>
				</div>
			)}

			{/* Show error message */}
			{error && (
				<div className='bg-red-100 text-red-700 border border-red-400 p-4 rounded-md mb-6'>
					<p>{error}</p>
				</div>
			)}

			{/* Show total revenue and activity details */}
			{revenue && (
				<div>
					{/* Display total revenue */}
					<div className='p-6 bg-blue-50 rounded-lg shadow-md mb-8'>
						<h3 className='text-xl text-blue-700 text-center mb-4'>
							Total Revenue
						</h3>
						<p className='text-2xl font-bold text-center'>
							${revenue.totalRevenue}
						</p>
					</div>

					{/* Display activity details */}
					<h4 className='text-lg text-gray-800 mb-4 text-center'>
						Seller Overview
					</h4>
					<ul className='divide-y divide-gray-300'>
						{revenue.products.map((product) => (
							<li
								key={product.id}
								className='p-4 bg-white rounded-lg shadow-sm mb-4'>
								<h5 className='text-lg font-semibold text-blue-600'>
									{product.name}
								</h5>
								<div className='flex justify-between mt-2'>
									<p>
										<strong>Price:</strong> ${product.price}
									</p>
									<p>
										<strong>Status:</strong>{' '}
										<span
											className={`${
												product.isBooked ? 'text-green-500' : 'text-red-500'
											}`}>
											{product.isBooked ? 'Booked' : 'Not Booked'}
										</span>
									</p>
								</div>
								<p className='mt-2'>
									<strong>Revenue:</strong> ${product.revenue}
								</p>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Button to manually refresh data */}
			<div className='text-center mt-6'>
				<button
					onClick={fetchRevenue}
					className={`px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						loading ? 'cursor-not-allowed opacity-50' : ''
					}`}
					disabled={loading}>
					{loading ? 'Fetching...' : 'Refresh Revenue Data'}
				</button>
			</div>
		</div>
	);
};

export default ProductRevenue;
