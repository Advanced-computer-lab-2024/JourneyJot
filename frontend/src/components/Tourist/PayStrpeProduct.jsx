/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation to safely access location data
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; // Import Stripe Elements
import { ToastContainer, toast } from 'react-toastify'; // Import React Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Loading Icon

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
					toast.error('Failed to fetch cart. Please try again.');
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
			toast.error('Stripe has not loaded yet. Please try again later.');
			setLoading(false);
			return;
		}

		// Create a payment method with the CardElement
		const cardElement = elements.getElement(CardElement);

		if (!cardElement) {
			toast.error('Card details are incomplete.');
			setLoading(false);
			return;
		}

		// Create a PaymentMethod
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
		});

		if (error) {
			console.error(error.message);
			toast.error(`Payment Method Error: ${error.message}`);
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
			toast.success('Payment was successful!');
			navigate('/tourist/homePage');
		} catch (error) {
			console.error('Error during payment:', error);
			toast.error(
				error.response?.data?.message ||
					'Payment failed! Please try again later.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-300 flex items-center justify-center p-4'>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
			/>

			<div className='bg-white shadow-xl rounded-lg p-8 w-full max-w-md'>
				<button
					onClick={() => navigate(-2)}
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
				<h1 className='text-2xl font-bold text-center text-teal-600 mb-6'>
					Complete Your Payment
				</h1>
				<div className='text-lg font-medium text-gray-700 mb-6'>
					Total: <span className='text-teal-600'>${totalCost.toFixed(2)}</span>
				</div>

				<form onSubmit={handlePayment}>
					{/* Card Element */}
					<div className='mb-6'>
						<label
							htmlFor='card'
							className='block text-gray-700 font-semibold mb-2'>
							Credit or Debit Card
						</label>
						<div className='bg-gray-100 p-3 rounded-md border border-gray-300'>
							<CardElement
								id='card'
								options={{
									style: {
										base: {
											fontSize: '16px',
											color: '#424770',
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
					</div>

					{/* Pay Button */}
					<button
						type='submit'
						disabled={loading || !stripe || !elements}
						className={`w-full py-3 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center ${
							loading ? 'cursor-not-allowed opacity-50' : ''
						}`}>
						{loading ? (
							<>
								<AiOutlineLoading3Quarters className='animate-spin mr-2' />
								Processing...
							</>
						) : (
							'Pay Now'
						)}
					</button>
				</form>

				{/* Optional: Display Cart Items */}
				{cart.length > 0 && (
					<div className='mt-8'>
						<h2 className='text-xl font-semibold text-gray-800 mb-4'>
							Your Cart
						</h2>
						<ul className='space-y-3'>
							{cart.map((item) => (
								<li
									key={item.productId._id}
									className='flex justify-between items-center bg-gray-50 p-3 rounded-md'>
									<span className='font-medium'>{item.productId.name}</span>
									<span className='text-gray-700'>
										{item.quantity} x ${item.productId.price.toFixed(2)}
									</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default BuyProductsCardVisa;
