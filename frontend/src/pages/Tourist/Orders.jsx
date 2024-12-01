/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PreviousPurchases = () => {
	const [purchases, setPurchases] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPreviousPurchases = async () => {
			try {
				const token = localStorage.getItem('token'); // Or get it from wherever you store it
				const response = await axios.get(
					'http://localhost:3000/tourists/orders',
					{
						headers: {
							Authorization: `Bearer ${token}`, // Passing the auth token in the headers
						},
					}
				);
				setPurchases(response.data);
				setLoading(false); // Stop loading after data is fetched
			} catch (err) {
				setError('Error fetching previous purchases');
				setLoading(false);
				console.error(err);
			}
		};

		fetchPreviousPurchases();
	}, []);

	if (loading)
		return (
			<div className='text-center py-4'>
				<div className='animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500'></div>
				Loading...
			</div>
		);
	if (error)
		return <div className='text-center py-4 text-red-600'>{error}</div>;
	if (purchases.length === 0)
		return <div className='text-center py-4'>No previous purchases found.</div>;

	return (
		<div className='max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg'>
			<h1 className='text-4xl font-extrabold text-center mb-8 text-indigo-600'>
				Previous Purchases
			</h1>
			<ul className='space-y-6'>
				{purchases.map((purchase, index) => (
					<li
						key={index}
						className='bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300'>
						<div className='flex justify-between items-center'>
							<div className='text-lg font-semibold text-gray-800'>
								{purchase.productId.name}
							</div>
							<div className='text-sm text-gray-600'>
								Quantity: {purchase.quantity}
							</div>
						</div>
						<div className='mt-2 text-sm text-gray-500'>
							{purchase.productId.details}
						</div>
						<div className='mt-2 text-xs text-gray-400'>
							Purchase Date:{' '}
							{new Date(purchase.purchaseDate).toLocaleDateString()}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PreviousPurchases;
