/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TouristPoints = () => {
	const [points, setPoints] = useState(0);
	const [level, setLevel] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPoints = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) throw new Error('No token found. Please login again.');

				const config = {
					headers: { Authorization: `Bearer ${token}` },
				};

				const response = await axios.get(
					'http://localhost:3000/tourists/points',
					config
				);
				const { points } = response.data;

				setPoints(Math.floor(points)); // Set points as a whole number
				setLevel(calculateLevel(points)); // Determine level based on points
			} catch (error) {
				console.error('Error fetching points:', error);
				alert('Failed to load points. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchPoints();
	}, []);

	// Function to determine level based on points
	const calculateLevel = (points) => {
		if (points > 500000) return 3;
		if (points > 100000) return 2;
		return 1;
	};

	// Function to get badge based on level
	const getBadge = (level) => {
		switch (level) {
			case 1:
				return 'Bronze Badge';
			case 2:
				return 'Silver Badge';
			case 3:
				return 'Gold Badge';
			default:
				return 'No Badge';
		}
	};

	// Redeem points for wallet cash
	const handleRedeemPoints = async () => {
		try {
			// Check if the user has points to redeem
			if (points === 0) {
				alert('You have no points to redeem.');
				return;
			}

			const token = localStorage.getItem('token');
			if (!token) {
				alert('Please login to redeem points.');
				return;
			}

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const response = await axios.post(
				'http://localhost:3000/tourists/redeemPoints',
				{},
				config
			);

			// Update points and display new wallet balance
			setPoints(Math.floor(response.data.remainingPoints)); // Display remaining points as a whole number
			alert(
				`Points redeemed! New wallet balance: ${response.data.newWalletBalance.toFixed(
					2
				)} USD`
			);
		} catch (error) {
			console.error('Error redeeming points:', error);
			alert('Failed to redeem points. Please try again.');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6'>
			<div className='max-w-2xl mx-auto p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg shadow-lg'>
				<h1 className='text-3xl font-semibold text-center text-white mb-6'>
					Tourist Points
				</h1>
				<div className='bg-white p-6 rounded-lg shadow-md'>
					{loading ? (
						<p className='text-center text-gray-600'>Loading...</p>
					) : (
						<>
							<p className='text-xl font-medium text-gray-800 mb-2'>
								Your Points: <span className='text-green-500'>{points}</span>
							</p>
							<p className='text-xl font-medium text-gray-800 mb-2'>
								Your Level: <span className='text-blue-600'>Level {level}</span>
							</p>
							<p className='text-xl font-medium text-gray-800 mb-4'>
								Badge:{' '}
								<span className='text-yellow-500'>{getBadge(level)}</span>
							</p>
						</>
					)}
				</div>
				<button
					className='mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200'
					onClick={handleRedeemPoints}>
					Redeem Points for Wallet Cash
				</button>
			</div>
		</div>
	);
};

export default TouristPoints;
