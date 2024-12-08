/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BuyTouristCart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [purchaseStatus, setPurchaseStatus] = useState(null); // To store the purchase status message
	const navigate = useNavigate();

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
				const errorMessage =
					error.response?.data?.message || 'Error fetching cart.';
				toast.error(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchCart();
	}, []);

	// Calculate total price
	const getTotalPrice = () => {
		return cartItems.reduce(
			(total, item) => total + item.productId.price * item.quantity,
			0
		);
	};

	// Handle the purchase of products
	const handlePurchase = async () => {
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

			// Call the backend to process the purchase
			const response = await axios.post(
				'http://localhost:3000/tourists/buyProductsCard',
				{}, // Empty body as it's using the user cart
				config
			);

			// If successful, show success toast with transaction details
			setPurchaseStatus({
				success: true,
				message: response.data.message,
				transactionDetails: response.data.transactionDetails,
			});

			toast.success('Purchase completed successfully!');

			// Clear cart after successful purchase
			setCartItems([]);
		} catch (error) {
			// If error occurs, show error toast
			const errorMessage =
				error.response?.data?.message || 'Error during purchase.';
			setPurchaseStatus({
				success: false,
				message: errorMessage,
			});
			toast.error(errorMessage);
			console.error('Error during purchase:', error);
		}
	};

	if (loading) {
		return <div className='text-center mt-10 text-xl'>Loading...</div>;
	}

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 flex items-center justify-center relative'>
			{/* Toast Container for Notifications */}
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

			{/* Back Arrow */}
			<button
				onClick={() => navigate(-1)}
				className='absolute top-4 left-4 text-gray-700 hover:text-gray-900 focus:outline-none'
				aria-label='Go Back'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='w-8 h-8'
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
			</button>

			<div className='max-w-7xl mx-auto p-8 w-full'>
				<h1 className='text-3xl font-bold text-teal-600 mb-6 text-center'>
					Your Cart
				</h1>

				{cartItems.length === 0 ? (
					<p className='text-center text-gray-200 text-xl'>
						Your cart is empty.
					</p>
				) : (
					<>
						<div className='space-y-6'>
							{cartItems.map((item) => (
								<div
									key={`${item.productId._id}-${item.quantity}`}
									className='flex items-center justify-between border-b pb-4'>
									<div className='flex items-center space-x-4'>
										<img
											src={`http://localhost:3000/photos/${item.productId.picture}`}
											alt={item.productId.name}
											className='w-16 h-16 object-cover rounded-md shadow-sm'
										/>
										<div>
											<h2 className='text-lg font-semibold text-gray-800 truncate'>
												{item.productId.name}
											</h2>
											<p className='text-gray-500'>
												${item.productId.price.toFixed(2)}
											</p>
										</div>
									</div>

									<div className='flex items-center space-x-4'>
										<span className='text-gray-700'>
											Quantity: {item.quantity}
										</span>
									</div>
								</div>
							))}
						</div>

						{/* Display total price */}
						<div className='mt-6 text-right'>
							<p className='text-lg font-semibold text-gray-800'>
								Total: ${getTotalPrice().toFixed(2)}
							</p>
						</div>

						{/* Purchase Button */}
						<div className='mt-6 text-center'>
							<button
								onClick={handlePurchase}
								className={`bg-teal-500 text-white py-3 px-6 rounded-md shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
									cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
								}`}
								disabled={cartItems.length === 0} // Disable the button if the cart is empty
								aria-label='Complete Purchase'>
								Complete Purchase
							</button>
						</div>

						{/* Purchase Status */}
						{purchaseStatus && purchaseStatus.success && (
							<div className='mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md'>
								<p>{purchaseStatus.message}</p>
								<div className='mt-2'>
									<p className='font-semibold'>Transaction Details:</p>
									<ul className='list-disc list-inside'>
										<li>
											Total Cost: $
											{purchaseStatus.transactionDetails.totalCost.toFixed(2)}
										</li>
										<li>
											Points Earned:{' '}
											{purchaseStatus.transactionDetails.pointsEarned}
										</li>
										<li>
											New Wallet Balance: $
											{purchaseStatus.transactionDetails.updatedWalletBalance.toFixed(
												2
											)}
										</li>
									</ul>
								</div>
							</div>
						)}

						{purchaseStatus && !purchaseStatus.success && (
							<div className='mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md'>
								<p>{purchaseStatus.message}</p>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default BuyTouristCart;
