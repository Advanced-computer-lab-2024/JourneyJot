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
		<div className='p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg'>
			<h2 className='text-center text-gray-800 text-3xl mb-8'>
				Attraction Revenue Dashboard
			</h2>

			{/* Show loading state */}
			{loading && (
				<div className='flex justify-center items-center h-24'>
					<p className='text-xl text-blue-500'>Loading...</p>
				</div>
			)}

			{/* Show error message */}
			{error && (
				<div className='p-4 bg-red-100 text-red-700 rounded-lg mb-6'>
					<p>{error}</p>
				</div>
			)}

			{/* Show total revenue and attraction details */}
			{revenue && (
				<div>
					{/* Display total revenue */}
					<div className='p-6 bg-blue-50 rounded-lg shadow-md mb-8'>
						<h3 className='text-center text-blue-700 text-2xl'>
							Total Revenue
						</h3>
						<p className='text-center text-2xl'>
							<strong>${revenue.totalRevenue}</strong>
						</p>
					</div>

					{/* Display attractions with revenue */}
					<h4 className='text-center text-gray-800 text-xl mb-4'>
						Attractions Overview
					</h4>
					<ul className='list-none p-0 m-0 border-t border-gray-300'>
						{revenue.attractions.map((attraction) => (
							<li
								key={attraction.id}
								className='p-4 border-b border-gray-300 bg-white rounded-md mb-4'>
								<h5 className='text-blue-600 text-lg'>{attraction.name}</h5>
								<div className='flex justify-between mt-4'>
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
								<p>
									<strong>Status:</strong>{' '}
									<span
										className={
											attraction.isBooked ? 'text-green-500' : 'text-red-500'
										}>
										{attraction.isBooked ? 'Booked' : 'Not Booked'}
									</span>
								</p>
								<p>
									<strong>Revenue:</strong> ${attraction.revenue}
								</p>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Button to manually refresh data */}
			<div className='text-center mt-8'>
				<button
					onClick={fetchRevenue}
					className={`px-6 py-3 bg-blue-500 text-white rounded-lg text-lg cursor-pointer ${
						loading ? 'opacity-50' : 'hover:bg-blue-600'
					}`}
					disabled={loading}>
					{loading ? 'Fetching...' : 'Refresh Revenue Data'}
				</button>
			</div>
		</div>
	);
};

export default AttractionRevenue;
