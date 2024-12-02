/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Function to retrieve token from localStorage
const getToken = () => {
	return localStorage.getItem('token') || '';
};

// Custom hook to handle notifications fetching
const useNotifications = (token) => {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null); // Added error state for better error handling

	useEffect(() => {
		if (token) {
			const fetchNotifications = async () => {
				try {
					const response = await axios.get(
						'http://localhost:3000/admins/notifications',
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setNotifications(response.data.notifications);
				} catch (error) {
					setError('Error fetching notifications.'); // Set error message
					console.error('Error fetching notifications:', error);
				} finally {
					setLoading(false);
				}
			};

			fetchNotifications();
		} else {
			setError('No token found.');
			setLoading(false);
		}
	}, [token]);

	return { notifications, loading, error };
};

// Custom hook to handle stock update
const useUpdateStock = (token) => {
	const updateStock = async (productId, newQuantity) => {
		try {
			const response = await axios.post(
				'http://localhost:3000/admins/update-stock',
				{ productId, newQuantity },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log(response.data.message);
		} catch (error) {
			console.error('Error updating stock:', error);
		}
	};

	return { updateStock };
};

const NotifyAdminProduct = () => {
	const [productId, setProductId] = useState('');
	const [newQuantity, setNewQuantity] = useState('');
	const [authToken, setAuthToken] = useState(getToken()); // Get token using getToken()

	const { notifications, loading, error } = useNotifications(authToken);
	const { updateStock } = useUpdateStock(authToken);

	const handleUpdateStock = () => {
		if (productId && newQuantity) {
			updateStock(productId, newQuantity);
		} else {
			alert('Please provide both product ID and new quantity.');
		}
	};

	return (
		<div className='p-6 bg-gray-100 rounded-lg shadow-lg'>
			<h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>

			{/* Update Stock Form */}
			<section className='mb-6'>
				<h2 className='text-xl font-semibold mb-3'>Update Product Stock</h2>
				<div className='mb-3'>
					<label className='block text-gray-700'>Product ID</label>
					<input
						type='text'
						value={productId}
						onChange={(e) => setProductId(e.target.value)}
						placeholder='Enter product ID'
						className='p-2 w-full border border-gray-300 rounded-lg'
					/>
				</div>
				<div className='mb-3'>
					<label className='block text-gray-700'>New Quantity</label>
					<input
						type='number'
						value={newQuantity}
						onChange={(e) => setNewQuantity(e.target.value)}
						placeholder='Enter new quantity'
						className='p-2 w-full border border-gray-300 rounded-lg'
					/>
				</div>
				<button
					onClick={handleUpdateStock}
					className='bg-blue-500 text-white p-2 rounded-lg w-full'>
					Update Stock
				</button>
			</section>

			{/* Notifications Section */}
			<section>
				<h2 className='text-xl font-semibold mb-3'>Notifications</h2>
				{loading ? (
					<p>Loading notifications...</p>
				) : error ? (
					<p className='text-red-500'>{error}</p> // Display error message
				) : notifications.length > 0 ? (
					<ul className='space-y-3'>
						{notifications.map((notification) => (
							<li
								key={notification._id}
								className='bg-white p-3 rounded-lg shadow-sm'>
								{notification.message}
							</li>
						))}
					</ul>
				) : (
					<p>No notifications available</p>
				)}
			</section>
		</div>
	);
};

export default NotifyAdminProduct;
