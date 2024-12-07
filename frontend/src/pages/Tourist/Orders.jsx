/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PreviousPurchases = () => {
	const [purchases, setPurchases] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

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
	const cancelOrder = async (productId, purchaseId) => {
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
					purchase.productId._id === productId && purchase._id === purchaseId
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
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6'>
			<div className='max-w-7xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md'>
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
				<h1 className='text-3xl font-semibold text-center text-indigo-800 mb-8'>
					Purchase History
				</h1>
				<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{purchases.map((purchase, index) => (
						<li
							key={index}
							className='bg-gray-50 rounded-md shadow-sm p-4 hover:shadow-md transform hover:scale-105 transition duration-200'>
							<div className='flex items-center justify-between mb-2'>
								<h2 className='text-base font-semibold text-gray-800 truncate'>
									{purchase.productId.name}
								</h2>
								<span
									className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
										purchase.status === 'purchased'
											? 'bg-green-100 text-green-700'
											: purchase.status === 'canceled'
											? 'bg-red-100 text-red-700'
											: 'bg-yellow-100 text-yellow-700'
									}`}>
									{purchase.status}
								</span>
							</div>
							<p className='text-gray-600 text-xs mb-2 line-clamp-2'>
								{purchase.productId.details}
							</p>
							<div className='flex justify-between text-xs text-gray-500 border-t pt-1'>
								<span>
									<strong>Qty:</strong> {purchase.quantity}
								</span>
								<span>
									<strong>Price:</strong> ${purchase.price}
								</span>
							</div>
							<div className='text-xs text-gray-500 mt-1'>
								<span>
									<strong>Date:</strong>{' '}
									{new Date(purchase.purchaseDate).toLocaleDateString()}
								</span>
							</div>
							{purchase.status === 'purchased' && (
								<div className='mt-3'>
									<button
										onClick={() =>
											cancelOrder(purchase.productId._id, purchase._id)
										}
										className='bg-red-600 text-white w-full py-1.5 rounded-md hover:bg-red-700 transition duration-200 text-sm'>
										Cancel Order
									</button>
								</div>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default PreviousPurchases;
