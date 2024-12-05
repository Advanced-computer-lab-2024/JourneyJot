/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const TouristCart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [purchaseError, setPurchaseError] = useState('');
	const [purchaseSuccess, setPurchaseSuccess] = useState(false);
	const navigate = useNavigate();

	// Fetch the cart from the backend
	useEffect(() => {
		const fetchCart = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					throw new Error('No token found. Please log in again.');
				}

				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};

				const response = await axios.get(
					'http://localhost:3000/tourists/getCart',
					config
				);

				setCartItems(response.data || []); // Ensure cart items are set correctly
			} catch (error) {
				setError(error.response?.data?.message || 'Error fetching cart.');
			} finally {
				setLoading(false);
			}
		};

		fetchCart();
	}, []);

	// Update the quantity of a product
	const updateQuantity = async (productId, newQuantity) => {
		if (!productId || newQuantity < 1) return;

		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please log in again.');
			}

			const response = await axios.put(
				`http://localhost:3000/tourists/cart/update/${productId}`,
				{ quantity: newQuantity },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setCartItems(response.data.cart);
		} catch (error) {
			setError(error.response?.data?.message || 'Error updating cart item.');
		}
	};

	// Remove a product from the cart
	const removeProduct = async (productId) => {
		if (!productId) return;

		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please log in again.');
			}

			const response = await axios.delete(
				`http://localhost:3000/tourists/cart/remove/${productId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setCartItems(response.data.cart);
		} catch (error) {
			setError(error.response?.data?.message || 'Error removing cart item.');
		}
	};

	// Calculate total price
	const getTotalPrice = () => {
		return cartItems.reduce((total, item) => {
			const price = item.productId?.price || 0;
			return total + price * item.quantity;
		}, 0);
	};

	// Handle the product purchase
	const handlePurchase = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please log in again.');
			}

			const response = await axios.post(
				'http://localhost:3000/tourists/buyProductCard',
				{ products: cartItems },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setPurchaseSuccess(true);
			setPurchaseError('');
			setCartItems([]);
		} catch (error) {
			setPurchaseError(
				error.response?.data?.message || 'Error completing purchase.'
			);
			setPurchaseSuccess(false);
		}
	};

	// Navigate to Stripe payment page
	const handlePayProductViaStripe = (product) => {
		if (!product) {
			console.error('Product data is missing!');
			return;
		}

		// Pass the necessary cart data to navigate
		navigate('/pay-product-stripe', {
			state: {
				cartItems, // Send the full cart
			},
		});
	};

	// Handle cash on delivery payment
	const handleCashOnDelivery = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please log in again.');
			}

			const response = await axios.post(
				'http://localhost:3000/tourists/buyProductCard',
				{ products: cartItems, paymentMethod: 'COD' },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setPurchaseSuccess(true);
			setPurchaseError('');
			setCartItems([]);
		} catch (error) {
			setPurchaseError(
				error.response?.data?.message || 'Error completing purchase.'
			);
			setPurchaseSuccess(false);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='p-8 bg-gray-50 shadow-lg rounded-lg w-full max-w-3xl'>
				<h1 className='text-4xl font-bold text-teal-600 mb-8 text-center'>
					Your Cart
				</h1>

				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
				{purchaseError && (
					<p className='text-red-500 text-center mb-4'>{purchaseError}</p>
				)}
				{purchaseSuccess && (
					<p className='text-green-500 text-center mb-4'>
						Purchase successful!
					</p>
				)}

				{cartItems.length === 0 ? (
					<p className='text-center text-lg font-medium text-gray-700'>
						Your cart is empty
					</p>
				) : (
					<div className='space-y-8'>
						{cartItems.map((item) => (
							<div
								key={item.productId._id}
								className='flex items-center justify-between border-b pb-4'>
								<div className='flex items-center space-x-6'>
									<img
										src={`http://localhost:3000/photos/${item.productId.picture}`}
										alt={item.productId.name}
										className='w-20 h-20 object-cover rounded-lg shadow-md'
									/>
									<div>
										<h2 className='text-xl font-semibold text-gray-800'>
											{item.productId.name}
										</h2>
										<p className='text-gray-500 text-sm'>
											${item.productId.price}
										</p>
									</div>
								</div>

								<div className='flex items-center space-x-4'>
									<button
										onClick={() =>
											updateQuantity(item.productId._id, item.quantity - 1)
										}
										disabled={item.quantity <= 1}
										className='bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 focus:outline-none transition-all'>
										-
									</button>
									<span className='text-lg font-medium'>{item.quantity}</span>
									<button
										onClick={() =>
											updateQuantity(item.productId._id, item.quantity + 1)
										}
										className='bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 focus:outline-none transition-all'>
										+
									</button>
									<button
										onClick={() => removeProduct(item.productId._id)}
										className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none transition-all'>
										Remove
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				<div className='mt-6 text-right'>
					<p className='text-2xl font-semibold text-gray-800'>
						Total: ${getTotalPrice()}
					</p>
				</div>

				<div className='mt-8 space-x-6 flex justify-center'>
					<button
						onClick={handlePurchase}
						className='bg-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all'>
						Complete Purchase
					</button>
					<button
						onClick={() => handlePayProductViaStripe(cartItems)}
						className='bg-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all'>
						Pay Visa
					</button>
					<button
						onClick={handleCashOnDelivery}
						className='bg-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all'>
						Cash on Delivery
					</button>
				</div>
			</div>
		</div>
	);
};

export default TouristCart;
