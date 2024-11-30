/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // To navigate to the checkout page

const TouristCart = () => {
	// State to store the cart items and total
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// Fetch the cart from the backend
	useEffect(() => {
		const fetchCart = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					throw new Error('No token found. Please login again.');
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

				setCartItems(response.data || []);
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
		if (!productId) {
			console.error('Product ID is missing!');
			return; // Exit if productId is undefined
		}

		if (newQuantity < 1) return; // Prevent negative quantities

		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please login again.');
			}

			const response = await axios.put(
				`http://localhost:3000/tourists/cart/update/${productId}`,
				{ quantity: newQuantity },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			// Ensure the cartItems state is updated correctly
			const updatedCart = response.data.cart;
			setCartItems(updatedCart);
		} catch (error) {
			setError(error.response?.data?.message || 'Error updating cart item.');
		}
	};

	// Remove a product from the cart
	const removeProduct = async (productId) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please login again.');
			}

			const response = await axios.delete(
				`http://localhost:3000/tourists/cart/remove/${productId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			// Update cart after successful removal
			setCartItems(response.data.cart);
		} catch (error) {
			setError(error.response?.data?.message || 'Error removing cart item.');
		}
	};

	// Calculate total price
	const getTotalPrice = () => {
		return cartItems.reduce(
			(total, item) => total + item.productId.price * item.quantity,
			0
		);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='p-6 bg-gray-50 min-h-screen'>
			<h1 className='text-3xl font-bold text-teal-600 mb-6'>Your Cart</h1>

			{error && <p className='text-red-500'>{error}</p>}

			{cartItems.length === 0 ? (
				<p>Your cart is empty</p>
			) : (
				<div className='space-y-6'>
					{cartItems.map((item) => (
						// Ensure the key is unique
						<div
							key={`${item.productId._id}-${item.quantity}`} // Updated key to ensure uniqueness
							className='flex items-center justify-between border-b pb-4'>
							<div className='flex items-center space-x-4'>
								<img
									src={`http://localhost:3000/photos/${item.productId.picture}`}
									alt={item.productId.name}
									className='w-16 h-16 object-cover'
								/>
								<div>
									<h2 className='text-lg font-semibold'>
										{item.productId.name}
									</h2>
									<p className='text-gray-500'>${item.productId.price}</p>
								</div>
							</div>

							<div className='flex items-center space-x-4'>
								<button
									onClick={() =>
										updateQuantity(item.productId._id, item.quantity - 1)
									}
									disabled={item.quantity <= 1}
									className='bg-teal-500 text-white p-2 rounded-md'>
									-
								</button>
								<span>{item.quantity}</span>
								<button
									onClick={() =>
										updateQuantity(item.productId._id, item.quantity + 1)
									}
									className='bg-teal-500 text-white p-2 rounded-md'>
									+
								</button>
								<button
									onClick={() => removeProduct(item.productId._id)} // Pass the correct productId
									className='bg-red-500 text-white p-2 rounded-md'>
									Remove
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Display total price */}
			<div className='mt-6 text-right'>
				<p className='text-lg font-semibold'>Total: ${getTotalPrice()}</p>
			</div>
		</div>
	);
};

export default TouristCart;
