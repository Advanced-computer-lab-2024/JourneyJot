/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const PaymentPage = () => {
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
				'http://localhost:3000/tourists/pay-stripe',
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
		<div className='payment-container p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg'>
			<h2 className='text-xl font-bold text-center mb-4'>Payment Page</h2>
			<p className='text-center text-lg'>
				You're about to pay for the activity: <strong>{activity?.name}</strong>
			</p>
			<p className='text-center text-md mb-4'>
				Price: {(activity?.price * conversionRate).toFixed(2)} {currency}
			</p>

			{paymentStatus && (
				<p className='text-center text-xl font-semibold text-green-600 mb-4'>
					{paymentStatus}
				</p>
			)}

			{/* Card Element for Stripe payment */}
			<div className='mb-4'>
				<CardElement className='mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500' />
			</div>

			{/* Optional: Display wallet balance if you want to allow the user to apply wallet credits */}
			<div className='mb-4'>
				<label className='block text-sm font-medium text-gray-700'>
					Wallet Balance
				</label>
				<input
					type='number'
					className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
					placeholder='Enter wallet amount'
					value={walletAmount}
					onChange={(e) => setWalletAmount(parseFloat(e.target.value))}
				/>
			</div>

			<button
				onClick={handleFakeVisaPayment}
				className='bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-500 w-full mt-4'
				disabled={
					isLoading || !stripe || !elements || !walletAmount || walletAmount < 0
				}>
				{isLoading ? 'Processing Payment...' : 'Pay with Fake Visa'}
			</button>
		</div>
	);
};

export default PaymentPage;
