/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PreviousPurchases = () => {
	const [purchases, setPurchases] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch the previous purchases when the component is mounted
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

	// Cancel the order and update the state accordingly
	const cancelOrder = async (productId) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.delete(
				`http://localhost:3000/tourists/cancel-orders/${productId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// On success, update the state to reflect the canceled order
			setPurchases((prevPurchases) =>
				prevPurchases.map((purchase) =>
					// Check if the productId matches and set all instances to canceled
					purchase.productId._id === productId
						? { ...purchase, status: 'canceled' } // Mark as canceled
						: purchase
				)
			);
			alert(response.data.message); // Show success message
		} catch (err) {
			alert(
				'Error canceling the order: ' +
					(err.response?.data?.message || err.message)
			);
		}
	};

	// Render loading spinner
	if (loading)
		return (
			<div className='flex flex-col items-center justify-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500'></div>
				<p className='mt-4 text-blue-600 font-medium'>Loading...</p>
			</div>
		);

	// Render error message
	if (error)
		return (
			<div className='flex flex-col items-center justify-center h-screen'>
				<p className='text-red-600 font-bold'>{error}</p>
			</div>
		);

	// Render if no purchases found
	if (purchases.length === 0)
		return (
			<div className='flex flex-col items-center justify-center h-screen'>
				<p className='text-gray-500 font-medium'>
					No previous purchases found.
				</p>
			</div>
		);

	// Render the list of previous purchases
	return (
		<div className='max-w-5xl mx-auto px-6 py-10 bg-gray-100 min-h-screen'>
			<h1 className='text-4xl font-extrabold text-center text-indigo-700 mb-10'>
				Previous Purchases
			</h1>
			<ul className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				{purchases.map((purchase, index) => (
					<li
						key={index}
						className='bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-xl transition duration-300'>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='text-xl font-bold text-gray-800'>
								{purchase.productId.name}
							</h2>
							<span
								className={`px-3 py-1 text-sm font-semibold rounded-full ${
									purchase.status === 'purchased'
										? 'bg-green-100 text-green-800'
										: purchase.status === 'canceled'
										? 'bg-red-100 text-red-800'
										: 'bg-yellow-100 text-yellow-800'
								}`}>
								{purchase.status}
							</span>
						</div>
						<p className='text-gray-600 mb-2'>{purchase.productId.details}</p>
						<div className='flex justify-between text-sm text-gray-500'>
							<span>Quantity: {purchase.quantity}</span>
							<span>Price: {purchase.price}</span>
							<span>
								Date: {new Date(purchase.purchaseDate).toLocaleDateString()}
							</span>
						</div>
						<div className='mt-4'>
							{purchase.status === 'purchased' && (
								<button
									onClick={() => cancelOrder(purchase.productId._id)}
									className='bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition'>
									Cancel Order
								</button>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PreviousPurchases;
