/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TouristWallet = () => {
	const [walletBalance, setWalletBalance] = useState(null); // Initial balance state
	const [loading, setLoading] = useState(true); // Loading state

	useEffect(() => {
		// Function to fetch wallet balance from backend
		const fetchWalletBalance = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) throw new Error('No token found. Please login again.');

				const config = {
					headers: { Authorization: `Bearer ${token}` },
				};

				// Call backend endpoint to get wallet balance
				const response = await axios.get(
					'http://localhost:3000/tourists/wallet',
					config
				);
				setWalletBalance(response.data.walletBalance); // Update balance from response
			} catch (error) {
				console.error('Error fetching wallet balance:', error);
				alert('Failed to load wallet balance. Please try again later.');
			} finally {
				setLoading(false); // Stop loading spinner
			}
		};

		fetchWalletBalance(); // Trigger fetch on component mount
	}, []);

	const handleAddFunds = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				alert('Please login to add funds.');
				return;
			}

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			// Call backend endpoint to add funds
			const response = await axios.post(
				'http://localhost:3000/tourists/wallet/addFunds',
				{},
				config
			);
			setWalletBalance(response.data.newBalance); // Update wallet balance in state

			alert('Funds added successfully!');
		} catch (error) {
			console.error('Error adding funds:', error);
			alert('Failed to add funds. Please try again later.');
		}
	};

	const handleViewHistory = () => {
		alert('Opening transaction history...');
		// Implement navigation to transaction history page or modal here
	};

	return (
		<div className='max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg'>
			<h1 className='text-2xl font-bold text-center mb-4'>Wallet</h1>
			<div className='bg-white p-4 rounded-lg shadow text-center'>
				{loading ? (
					<p className='text-lg font-semibold text-gray-500'>Loading...</p>
				) : (
					<p className='text-lg font-semibold'>
						Wallet Balance:{' '}
						<span className='text-blue-600'>${walletBalance}</span>
					</p>
				)}
			</div>
			<div className='mt-4 space-y-3'>
				<button
					className='w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition duration-200'
					onClick={handleAddFunds}>
					Add 1000$ to Wallet
				</button>
				<button
					className='w-full bg-gray-600 text-white py-2 rounded-md shadow hover:bg-gray-700 transition duration-200'
					onClick={handleViewHistory}>
					View Transaction History
				</button>
			</div>
		</div>
	);
};

export default TouristWallet;
