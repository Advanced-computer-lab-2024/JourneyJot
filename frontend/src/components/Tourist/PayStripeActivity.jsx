/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const ActivityPaymentPage = () => {
	const [paymentStatus, setPaymentStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [walletAmount, setWalletAmount] = useState(0); // Optional: wallet balance if using wallet payments

	// Use the location hook to get the state passed from the previous page (ActivitiesCard)
	const location = useLocation();
	const { activity, currency, conversionRate = 1 } = location.state || {}; // Destructure the activity, currency, and conversionRate from state

	const navigate = useNavigate(); // We'll use this if we need to redirect after payment
	const stripe = useStripe();
	const elements = useElements();

	useEffect(() => {
		if (!activity) {
			navigate('/'); // If activity is missing, redirect to home or another page
		}
	}, [activity, navigate]);

	const handleFakeVisaPayment = async () => {
		setIsLoading(true);

		if (!stripe || !elements) {
			// Stripe.js or Elements is not yet loaded
			return;
		}

		try {
			// Create a PaymentMethod using the Stripe CardElement
			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: 'card',
				card: elements.getElement(CardElement),
			});

			if (error) {
				setPaymentStatus(`Payment failed: ${error.message}`);
				setIsLoading(false);
				return;
			}

			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			// Prepare payment data to send to the backend
			const paymentData = {
				amount: activity.price * conversionRate * 100, // Convert to smallest currency unit (e.g., cents)
				currency: currency || 'usd',
				paymentMethodId: paymentMethod.id, // PaymentMethod ID from Stripe
				walletAmount,
				activityId: activity._id, // Activity ID
			};

			// Send payment data to backend for processing
			const response = await axios.post(
				'http://localhost:3000/tourists/pay-stripe-activity',
				paymentData,
				config
			);

			const { message, paymentIntentId } = response.data;
			setPaymentStatus(
				`Payment successful! Transaction ID: ${paymentIntentId}`
			);
			navigate('/tourist/homePage');
		} catch (error) {
			setPaymentStatus(`Payment failed: ${error.message}`);
			console.error('Error during payment:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='payment-container p-8 max-w-lg mx-auto bg-white shadow-2xl rounded-2xl'>
				<h2 className='text-2xl font-bold text-center mb-6 text-gray-800 tracking-wide'>
					Payment Page
				</h2>

				<p className='text-center text-lg text-gray-700 mb-2'>
					You're about to pay for the activity:{' '}
					<strong>{activity?.name}</strong>
				</p>
				<p className='text-center text-lg font-semibold text-gray-900 mb-6'>
					Price: {(activity?.price * conversionRate).toFixed(2)} {currency}
				</p>

				{paymentStatus && (
					<p className='text-center text-xl font-semibold text-green-500 mb-6'>
						{paymentStatus}
					</p>
				)}

				{/* Card Element for Stripe payment */}
				<div className='mb-6'>
					<CardElement className='mt-2 block w-full p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800' />
				</div>

				{/* Wallet Balance Section */}
				<div className='mb-6'>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						Wallet Balance
					</label>
					<input
						type='number'
						className='mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'
						placeholder='Enter wallet amount'
						value={walletAmount}
						onChange={(e) => setWalletAmount(parseFloat(e.target.value))}
					/>
				</div>

				<button
					onClick={handleFakeVisaPayment}
					className='w-full py-3 text-lg font-semibold bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
					disabled={
						isLoading ||
						!stripe ||
						!elements ||
						!walletAmount ||
						walletAmount < 0
					}>
					{isLoading ? (
						<span className='flex items-center justify-center gap-2'>
							<svg
								className='animate-spin h-5 w-5 text-white'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z'></path>
							</svg>
							Processing Payment...
						</span>
					) : (
						'Pay with Fake Visa'
					)}
				</button>
			</div>
		</div>
	);
};

export default ActivityPaymentPage;
