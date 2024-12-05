/** @format */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FullProductPage = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [quantity, setQuantity] = useState(1); // Initial quantity set to 1
	const [showReviews, setShowReviews] = useState(false); // State for showing reviews
	const [rates, setRates] = useState({});
	const [selectedCurrency, setSelectedCurrency] = useState('USD');
	const [conversionRate, setConversionRate] = useState(1);

	useEffect(() => {
		// Fetch exchange rates
		axios
			.get(
				'https://v6.exchangerate-api.com/v6/c0f66f5d6657d5223735ba62/latest/USD'
			)
			.then((response) => {
				setRates(response.data.conversion_rates);
			})
			.catch((error) => {
				console.error('Error fetching exchange rates:', error);
			});
	}, []);

	const handleCurrencyChange = (event) => {
		const currency = event.target.value;
		setSelectedCurrency(currency);
		setConversionRate(rates[currency] || 1);
	};

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/products/${id}`
				);
				setProduct(response.data.product);
				setQuantity(1);
			} catch (err) {
				setError('Failed to fetch product data.');
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [id]);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/products/${id}`
				);
				setProduct(response.data.product);
				setQuantity(1); // Reset quantity to 1 when the product is loaded
			} catch (err) {
				setError('Failed to fetch product data.');
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	const renderStars = (rating) => {
		const totalStars = 5;
		return (
			<div className='flex'>
				{Array.from({ length: totalStars }, (_, index) => (
					<svg
						key={index}
						className={`w-6 h-6 ${
							index < rating ? 'text-yellow-500' : 'text-gray-300'
						}`}
						fill='currentColor'
						viewBox='0 0 20 20'
						xmlns='http://www.w3.org/2000/svg'>
						<path d='M9.049 2.927a1 1 0 011.902 0l1.715 4.801a1 1 0 00.95.69h5.033a1 1 0 01.612 1.79l-4.07 2.959a1 1 0 00-.364 1.118l1.715 4.801a1 1 0 01-1.536 1.118L10 15.347l-4.365 3.171a1 1 0 01-1.536-1.118l1.715-4.801a1 1 0 00-.364-1.118L1.38 9.208a1 1 0 01.612-1.79h5.033a1 1 0 00.95-.69l1.715-4.801z' />
					</svg>
				))}
			</div>
		);
	};

	const handleIncreaseQuantity = () => {
		if (product && quantity < product.quantity) {
			setQuantity((prevState) => prevState + 1);
		} else {
			alert('Cannot add more than available stock');
		}
	};

	const handleDecreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity((prevState) => prevState - 1);
		}
	};

	const addToProductsList = async () => {
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

			const response = await axios.post(
				`http://localhost:3000/tourists/buyProduct`,
				{
					quantity,
					productId: id,
				},
				config
			);
			const { transactionDetails } = response.data;

			// Display transaction details in the alert
			alert(
				`Transaction Details:\n` +
					`- Total Cost: $${transactionDetails.totalCost}\n` +
					`- Updated Wallet Balance: $${transactionDetails.updatedWalletBalance}\n` +
					`- Points Earned: ${transactionDetails.pointsEarned}\n` +
					`- Total Points: ${transactionDetails.totalPoints}`
			);
		} catch (err) {
			console.error('Error adding product to cart:', err); // Log the error
			alert(
				`Failed to add product to cart: ${
					err.response?.data?.message || err.message
				}`
			);
		}
	};

	const addToWishList = async () => {
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

			const response = await axios.post(
				`http://localhost:3000/tourists/addToWishList`,
				{
					productId: id,
				},
				config
			);
			const { message } = response.data;

			// Display success message in the alert
			alert(message);
		} catch (err) {
			console.error('Error adding product to wishlist:', err); // Log the error
			alert(
				`Failed to add product to wishlist: ${
					err.response?.data?.message || err.message
				}`
			);
		}
	};

	const addToCart = async () => {
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

			const response = await axios.post(
				`http://localhost:3000/tourists/addToCart/${id}`,
				{
					quantity, // Send the selected quantity
				},
				config
			);

			// Display success message
			console.log(response);
			alert('Product added to cart successfully!');
		} catch (err) {
			console.error('Error adding product to cart:', err); // Log the error
			alert(
				`Failed to add product to cart: ${
					err.response?.data?.message || err.message
				}`
			);
		}
	};

	if (loading) return <div className='text-center py-6'>Loading...</div>;
	if (error) return <div className='text-center py-6'>{error}</div>;
	//console.log(product);

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl space-y-6'>
				<div>
					<label
						htmlFor='currency-select'
						className='text-xl font-semibold'>
						Select Currency:
					</label>
					<select
						id='currency-select'
						value={selectedCurrency}
						onChange={handleCurrencyChange}
						className='mt-2 p-2 rounded-md border border-gray-300 bg-white text-lg focus:outline-none focus:ring-2 focus:ring-teal-400'>
						{Object.keys(rates).map((currency) => (
							<option
								key={currency}
								value={currency}>
								{currency}
							</option>
						))}
					</select>
				</div>

				{product ? (
					<>
						<div className='flex flex-col md:flex-row pt-8 space-y-6 md:space-y-0 md:space-x-6'>
							{/* Left: Product Image */}
							{product.picture && (
								<div className='md:w-1/2'>
									<img
										src={`http://localhost:3000/photos/${product.picture}`}
										alt={product.name}
										className='w-full h-80 object-cover rounded-lg shadow-lg'
									/>
								</div>
							)}

							{/* Right: Product Information */}
							<div className='md:w-1/2 space-y-6'>
								<h1 className='text-3xl font-bold text-gray-800'>
									{product.name}
								</h1>
								<p className='text-gray-700'>{product.details}</p>
								<p className='text-xl font-semibold text-gray-800'>
									Price:{' '}
									{(product.price * conversionRate * quantity).toFixed(2)}{' '}
									{selectedCurrency}
								</p>
								<p className='text-lg text-gray-700'>
									Available Quantity: {product.quantity}
								</p>

								{/* Quantity controls */}
								<div className='flex items-center space-x-4'>
									<button
										onClick={handleDecreaseQuantity}
										className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-md transition-all'>
										-
									</button>
									<span className='text-xl font-semibold'>{quantity}</span>
									<button
										onClick={handleIncreaseQuantity}
										className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-md transition-all'>
										+
									</button>
								</div>

								{/* Rating */}
								<div className='flex items-center'>
									<p className='text-gray-700 mr-4 font-semibold'>Rating:</p>
									{renderStars(Math.round(product.rating || 0))}
								</div>

								{/* CTA Buttons */}
								<div className='flex flex-col gap-4 mt-6'>
									<div className='flex gap-6'>
										<button
											className='bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105'
											onClick={addToProductsList}>
											Buy Now
										</button>
										<button
											className='bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105'
											onClick={addToWishList}>
											Add to WishList
										</button>
									</div>
									<div>
										<button
											className='bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105'
											onClick={addToCart}>
											Add to Cart
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Reviews Section */}
						<div className='mt-8'>
							<h2 className='text-2xl font-bold text-gray-800 mb-4'>Reviews</h2>

							<div className='flex items-center mb-4'>
								<p className='text-gray-700 mr-4'>
									Reviews ({product.reviews.length})
								</p>
								<button
									onClick={() => setShowReviews(!showReviews)}
									className='bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300'>
									{showReviews ? 'Hide Reviews' : 'Show Reviews'}
								</button>
							</div>

							{product.reviews.length === 0 && (
								<p className='text-gray-500'>
									No reviews yet. Be the first to review!
								</p>
							)}

							{showReviews && product.reviews && product.reviews.length > 0 ? (
								<div className='overflow-y-auto max-h-64 space-y-4'>
									{product.reviews.map((review, index) => (
										<div
											key={index}
											className='border-t border-gray-300 pt-4 mt-4 first:border-0 first:pt-0'>
											<p className='text-lg font-semibold text-gray-800'>
												{review.user.username}
											</p>
											<p className='text-gray-700'>{review.comment}</p>
											<div className='flex items-center mt-2'>
												{renderStars(review.rating)}
											</div>
										</div>
									))}
								</div>
							) : null}
						</div>
					</>
				) : (
					<div className='text-center text-gray-700'>Product not found</div>
				)}
			</div>
		</div>
	);
};

export default FullProductPage;
