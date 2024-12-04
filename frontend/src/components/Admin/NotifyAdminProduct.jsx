/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi'; // Icons for better visuals

// Function to retrieve token from localStorage
const getToken = () => {
	return localStorage.getItem('token') || '';
};

// Custom hook to handle notifications fetching
const useNotifications = (token) => {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (token) {
			const fetchNotifications = async () => {
				try {
					const response = await axios.get(
						`${'http://localhost:3000'}/admins/notifications`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setNotifications(response.data.notifications);
				} catch (error) {
					setError('Error fetching notifications.');
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
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const updateStock = async (productName, newQuantity) => {
		setLoading(true);
		try {
			const response = await axios.post(
				`${'http://localhost:3000'}/admins/update-stock`,
				{ productName, newQuantity },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setSuccessMessage(response.data.message);
			setErrorMessage('');
		} catch (error) {
			setErrorMessage('Error updating stock.');
			console.error('Error updating stock:', error);
		} finally {
			setLoading(false);
		}
	};

	return { updateStock, successMessage, errorMessage, loading };
};

const NotifyAdminProduct = () => {
	const [productName, setProductName] = useState('');
	const [newQuantity, setNewQuantity] = useState('');
	const [authToken, setAuthToken] = useState(getToken());
	const [formError, setFormError] = useState('');

	const { notifications, loading, error } = useNotifications(authToken);
	const {
		updateStock,
		successMessage,
		errorMessage,
		loading: updateLoading,
	} = useUpdateStock(authToken);

	const handleUpdateStock = () => {
		if (productName.trim() && newQuantity) {
			updateStock(productName.trim(), newQuantity);
			setFormError('');
		} else {
			setFormError('Please provide both product name and new quantity.');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='max-w-5xl w-full bg-white p-10 rounded-xl shadow-2xl space-y-10'>
				<h1 className='text-5xl font-bold text-center text-indigo-600'>
					Admin Dashboard
				</h1>

				{/* Update Stock Form */}
				<section className='bg-indigo-50 p-6 rounded-lg shadow-md'>
					<h2 className='text-2xl font-semibold text-indigo-700 mb-4'>
						Update Product Stock
					</h2>
					<div className='space-y-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Product Name
							</label>
							<input
								type='text'
								value={productName}
								onChange={(e) => setProductName(e.target.value)}
								placeholder='Enter product name'
								className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								New Quantity
							</label>
							<input
								type='number'
								value={newQuantity}
								onChange={(e) => setNewQuantity(e.target.value)}
								placeholder='Enter new quantity'
								className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
							/>
						</div>
						{formError && (
							<div className='flex items-center text-red-500 text-sm'>
								<FiAlertCircle className='mr-1' />
								{formError}
							</div>
						)}
						{errorMessage && (
							<div className='flex items-center text-red-500 text-sm'>
								<FiAlertCircle className='mr-1' />
								{errorMessage}
							</div>
						)}
						{successMessage && (
							<div className='flex items-center text-green-500 text-sm'>
								<FiCheckCircle className='mr-1' />
								{successMessage}
							</div>
						)}
						<button
							onClick={handleUpdateStock}
							disabled={updateLoading}
							className='w-full flex items-center justify-center bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50'>
							{updateLoading ? (
								<>
									<FiLoader className='animate-spin mr-2' />
									Updating...
								</>
							) : (
								'Update Stock'
							)}
						</button>
					</div>
				</section>

				{/* Notifications Section */}
				<section className='bg-indigo-50 p-6 rounded-lg shadow-md'>
					<h2 className='text-2xl font-semibold text-indigo-700 mb-4'>
						Notifications
					</h2>
					{loading ? (
						<div className='flex items-center justify-center text-gray-500'>
							<FiLoader className='animate-spin mr-2' />
							Loading notifications...
						</div>
					) : error ? (
						<div className='flex items-center text-red-500'>
							<FiAlertCircle className='mr-2' />
							{error}
						</div>
					) : notifications.length > 0 ? (
						<ul className='space-y-4'>
							{notifications.map((notification) => (
								<li
									key={notification._id}
									className='flex items-start bg-white p-4 rounded-lg shadow hover:bg-indigo-100 transition-colors'>
									<FiCheckCircle className='text-green-500 mt-1 mr-3' />
									<div>
										<p className='text-gray-800'>{notification.message}</p>
										<small className='text-gray-500'>
											{new Date(notification.createdAt).toLocaleString()}
										</small>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className='flex items-center justify-center text-gray-500'>
							<FiAlertCircle className='mr-2' />
							No notifications available
						</div>
					)}
				</section>
			</div>
		</div>
	);
};

export default NotifyAdminProduct;
