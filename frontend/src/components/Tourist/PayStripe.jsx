/** @format */

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [amount, setAmount] = useState(''); // Amount entered by user (in dollars)
	const [currency, setCurrency] = useState('usd');
	const [walletAmount, setWalletAmount] = useState(0); // Wallet balance (in dollars)
	const [isLoading, setIsLoading] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return; // Stripe.js hasn't loaded yet, disable form submission
		}

		// Validate amount and walletAmount
		if (amount <= 0 || isNaN(amount)) {
			setPaymentSuccess('Please enter a valid amount.');
			return;
		}
		if (walletAmount < 0 || isNaN(walletAmount)) {
			setPaymentSuccess('Please enter a valid wallet amount.');
			return;
		}

		setIsLoading(true);
		const cardElement = elements.getElement(CardElement);

		// Create the payment method
		const { paymentMethod, error } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
		});

		if (error) {
			setIsLoading(false);
			console.error(error);
			setPaymentSuccess('Error creating payment method: ' + error.message);
			return;
		}

		// Convert the amount and walletAmount to cents
		const amountInCents = Math.round(parseFloat(amount) * 100); // Convert amount to cents
		const walletAmountInCents = Math.round(parseFloat(walletAmount) * 100); // Convert wallet amount to cents

		try {
			const { data } = await axios.post(
				'http://localhost:3000/tourists/pay-stripe',
				{
					amount: amountInCents, // Amount in cents
					currency: currency,
					paymentMethodId: paymentMethod.id,
					walletAmount: walletAmountInCents, // Wallet amount in cents
				}
			);

			// Update the UI based on the response from the backend
			setPaymentSuccess(data.message || 'Payment processed successfully!');
		} catch (error) {
			setPaymentSuccess('Payment failed: ' + error.message);
		}

		setIsLoading(false);
	};

	return (
		<div className='max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg'>
			<h2 className='text-xl font-bold text-center mb-4'>Pay with Stripe</h2>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label
						className='block text-sm font-semibold mb-2'
						htmlFor='amount'>
						Amount (USD)
					</label>
					<input
						type='number'
						id='amount'
						name='amount'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className='w-full p-3 border border-gray-300 rounded-lg'
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-sm font-semibold mb-2'
						htmlFor='currency'>
						Currency
					</label>
					<select
						id='currency'
						name='currency'
						value={currency}
						onChange={(e) => setCurrency(e.target.value)}
						className='w-full p-3 border border-gray-300 rounded-lg'>
						<option value='usd'>USD</option>
						<option value='eur'>EUR</option>
						{/* Add other currencies as needed */}
					</select>
				</div>
				<div className='mb-4'>
					<label className='block text-sm font-semibold mb-2'>
						Card Information
					</label>
					<CardElement
						className='p-3 border border-gray-300 rounded-lg'
						options={{
							style: {
								base: {
									fontSize: '16px',
									color: '#32325d',
									lineHeight: '24px',
									fontFamily: 'Arial, sans-serif',
									'::placeholder': {
										color: '#aab7c4',
									},
								},
								invalid: {
									color: '#9e2146',
								},
							},
						}}
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-sm font-semibold mb-2'
						htmlFor='walletAmount'>
						Wallet Amount (USD)
					</label>
					<input
						type='number'
						id='walletAmount'
						name='walletAmount'
						value={walletAmount}
						onChange={(e) => setWalletAmount(e.target.value)}
						className='w-full p-3 border border-gray-300 rounded-lg'
						required
					/>
				</div>
				<div className='flex items-center justify-center'>
					<button
						type='submit'
						className='bg-blue-500 text-white py-2 px-4 rounded-lg'
						disabled={!stripe || isLoading}>
						{isLoading ? 'Processing...' : 'Pay'}
					</button>
				</div>
			</form>

			{paymentSuccess && (
				<div className='mt-4 text-center'>
					<p
						className={
							paymentSuccess.includes('failed')
								? 'text-red-500'
								: 'text-green-500'
						}>
						{paymentSuccess}
					</p>
				</div>
			)}
		</div>
	);
};

export default PaymentForm;
