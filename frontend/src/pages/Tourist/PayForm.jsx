/** @format */

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [amount, setAmount] = useState('');
	const [currency, setCurrency] = useState('usd');
	const [walletAmount, setWalletAmount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return; // Stripe.js has not yet loaded, disable form submission
		}

		setIsLoading(true);
		const cardElement = elements.getElement(CardElement);

		// Create a payment method
		const { paymentMethod, error } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
		});

		if (error) {
			setIsLoading(false);
			console.error(error);
			return;
		}

		// Convert amount to cents (Stripe expects the amount in the smallest currency unit)
		const amountInCents = amount * 100;

		try {
			// Send the paymentMethod.id to the backend to create the PaymentIntent
			const { data } = await axios.post(
				'http://localhost:3000/tourists/pay-stripe',
				{
					amount: amountInCents, // Amount in cents
					currency: currency,
					paymentMethodId: paymentMethod.id, // Send the paymentMethod id
					walletAmount: walletAmount, // User's wallet amount
				}
			);

			setPaymentSuccess(data.message || 'Payment processed successfully!');
		} catch (error) {
			setPaymentSuccess('Payment failed: ' + error.message);
		}

		setIsLoading(false);
	};

	return (
		<div>
			<h2>Pay with Stripe</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Amount (USD):
					<input
						type='number'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
				</label>

				<label>
					Currency:
					<select
						value={currency}
						onChange={(e) => setCurrency(e.target.value)}>
						<option value='usd'>USD</option>
						<option value='eur'>EUR</option>
					</select>
				</label>

				<CardElement />

				<label>
					Wallet Amount:
					<input
						type='number'
						value={walletAmount}
						onChange={(e) => setWalletAmount(e.target.value)}
					/>
				</label>

				<button
					type='submit'
					disabled={!stripe || isLoading}>
					{isLoading ? 'Processing...' : 'Pay'}
				</button>
			</form>

			{paymentSuccess && <p>{paymentSuccess}</p>}
		</div>
	);
};

export default PaymentForm;
