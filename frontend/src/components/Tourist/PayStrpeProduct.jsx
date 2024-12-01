/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation to safely access location data
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; // Import Stripe Elements

const BuyProductsCardVisa = () => {
	const location = useLocation(); // Use useLocation to get location state
	const navigate = useNavigate(); // Navigate after successful payment
	const [cart, setCart] = useState(location?.state?.cartItems || []); // Use location state safely
	const [totalCost, setTotalCost] = useState(0);
	const [loading, setLoading] = useState(false);

	// Stripe Elements hooks
	const stripe = useStripe();
	const elements = useElements();

	// Fetch the user's cart details from your backend if not passed through props
	useEffect(() => {
		// If cart is not passed via props, fetch cart details from the backend
		if (cart.length === 0) {
			const fetchCart = async () => {
				try {
					const response = await axios.get(
						'http://localhost:3000/tourists/getCart',
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token from localStorage
							},
						}
					);
					const cartData = response.data.cart || [];
					setCart(cartData);
					setTotalCost(
						cartData.reduce(
							(total, item) => total + item.quantity * item.productId.price,
							0
						)
					);
				} catch (error) {
					console.error('Error fetching cart:', error);
				}
			};

			fetchCart();
		} else {
			setTotalCost(
				cart.reduce(
					(total, item) => total + item.quantity * item.productId.price,
					0
				)
			);
		}
	}, [cart]);

	// Handle payment processing
	const handlePayment = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Check if Stripe.js and Elements are loaded
		if (!stripe || !elements) {
			console.log('Stripe.js has not yet loaded.');
			return;
		}

		// Create a payment method with the CardElement
		const cardElement = elements.getElement(CardElement);

		// Create a PaymentMethod
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
		});

		if (error) {
			console.error(error.message);
			alert('Error: ' + error.message);
			setLoading(false);
			return;
		}

		// Send the payment method ID and cart details to your backend
		try {
			const response = await axios.post(
				'http://localhost:3000/tourists/buyProductCardVisa',
				{
					cartItems: cart,
					paymentMethodId: paymentMethod.id,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in headers
					},
				}
			);

			console.log('Payment successful', response.data);
			alert('Payment was successful!');
			navigate('/payment-success'); // Navigate to success page (optional)
		} catch (error) {
			console.error('Error during payment:', error);
			alert('Payment failed!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full max-w-lg'>
			<h1 className='text-2xl font-semibold text-teal-600 mb-4'>
				Complete your Visa Payment
			</h1>
			<div className='text-lg font-medium text-gray-700 mb-6'>
				Total: <span className='text-teal-600'>${totalCost.toFixed(2)}</span>
			</div>

			{/* Card Element */}
			<div className='mb-6 w-full'>
				<CardElement className='w-full p-2 border rounded-md' />
			</div>

			{/* Pay Button */}
			<button
				onClick={handlePayment}
				disabled={loading || !stripe || !elements}
				className='w-full py-3 px-6 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all duration-300 disabled:bg-gray-400'>
				{loading ? 'Processing...' : 'Pay Now'}
			</button>
		</div>
	);
};

export default BuyProductsCardVisa;
