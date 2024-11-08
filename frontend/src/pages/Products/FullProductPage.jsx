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
			alert(response.data.message);
		} catch (err) {
			console.error('Error adding product to cart:', err); // Log the error
			alert(
				`Failed to add product to cart: ${
					err.response?.data?.message || err.message
				}`
			);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
			{product ? (
				<>
					<div className='flex flex-col md:flex-row pt-8'>
						{/* Left: Product Image */}
						{product.picture && (
							<div className='md:w-1/2 mb-4 md:mb-0 md:mr-4'>
								<img
									src={product.picture}
									alt={product.name}
									className='w-full h-80 object-cover rounded-lg'
								/>
							</div>
						)}

						{/* Right: Product Information */}
						<div className='md:w-1/2 flex flex-col justify-between'>
							<div>
								<h1 className='text-3xl font-bold mb-2'>{product.name}</h1>
								<p className='text-gray-700 mb-4'>{product.details}</p>
								<p className='text-gray-700 mb-2 text-xl font-semibold'>
									Price:{' '}
									<span className='text-green-600'>
										${(product.price * quantity).toFixed(2)}
									</span>
								</p>
								<p className='text-gray-700 mb-4'>
									Available Quantity: {product.quantity}
								</p>

								{/* Quantity controls */}
								<div className='flex items-center mb-4'>
									<button
										onClick={handleDecreaseQuantity}
										className='bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-l'>
										-
									</button>
									<span className='px-4'>{quantity}</span>
									<button
										onClick={handleIncreaseQuantity}
										className='bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-r'>
										+
									</button>
								</div>

								{/* Rating */}
								<div className='flex items-center mb-6'>
									<p className='text-gray-700 mr-2 font-semibold'>Rating:</p>
									{renderStars(Math.round(product.rating || 0))}
								</div>

								{/* CTA Button */}
								<button
									className='bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300'
									onClick={addToProductsList}>
									Buy Now
								</button>
							</div>
						</div>
					</div>

					{/* Reviews Section */}
					<div className='mt-8'>
						<h2 className='text-2xl font-bold mb-4'>Reviews</h2>

						<div className='flex items-center mb-4'>
							<p className='mr-4'>Reviews ({product.reviews.length})</p>
							<button
								onClick={() => setShowReviews(!showReviews)}
								className='bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg'>
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
										<p className='text-lg font-semibold'>
											{review.user.username}
										</p>
										<p className='text-gray-700'>{review.comment}</p>
										<div className='flex items-center mt-1'>
											{renderStars(review.rating)}
										</div>
									</div>
								))}
							</div>
						) : null}
					</div>
				</>
			) : (
				<div>Product not found</div>
			)}
		</div>
	);
};

export default FullProductPage;
