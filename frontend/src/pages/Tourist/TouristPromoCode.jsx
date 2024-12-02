/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromoCodesPage = () => {
	const [promoCodes, setPromoCodes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchPromoCodes = async () => {
			try {
				// Get the token from localStorage (ensure the token is available)
				const token = localStorage.getItem('token');

				// Check if the token exists
				if (!token) {
					setError('No token found. Please login.');
					setLoading(false);
					return;
				}

				// Define headers with the Authorization token
				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};

				// Make the GET request to the backend to fetch promo codes
				const response = await axios.get(
					'http://localhost:3000/tourists/promoCodes',
					config
				);

				// Set the response data (promo codes) into the state
				setPromoCodes(response.data.promoCodes);
			} catch (error) {
				// Handle errors and set an error message
				setError(
					error.response?.data?.message || 'Failed to fetch promo codes'
				);
			} finally {
				setLoading(false); // Ensure loading is set to false after the request completes
			}
		};
		fetchPromoCodes();
	}, []);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<p className='text-lg font-semibold'>Loading promo codes...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<p className='text-lg font-semibold text-red-500'>{error}</p>
			</div>
		);
	}

	return (
		<div className='max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold mb-6 text-gray-800'>
				Your Promo Codes
			</h2>
			{promoCodes.length === 0 ? (
				<p className='text-gray-600'>No promo codes available</p>
			) : (
				<ul className='space-y-4'>
					{promoCodes.map((promo) => (
						<li
							key={promo._id}
							className='p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-sm'>
							<div className='mb-2'>
								<span className='font-medium'>Code:</span> {promo.code}
							</div>
							<div className='mb-2'>
								<span className='font-medium'>Discount:</span> {promo.discount}%
							</div>
							<div>
								<span className='font-medium'>Expires:</span>{' '}
								{new Date(promo.expirationDate).toLocaleDateString()}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default PromoCodesPage;
