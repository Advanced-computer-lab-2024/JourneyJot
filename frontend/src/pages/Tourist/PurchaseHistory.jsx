/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StarRating = ({ rating, onChange }) => {
	const stars = [1, 2, 3, 4, 5];

	const handleStarClick = (star) => {
		onChange(star);
	};

	return (
		<div className='flex'>
			{stars.map((star) => (
				<svg
					key={star}
					xmlns='http://www.w3.org/2000/svg'
					className={`w-6 h-6 cursor-pointer ${
						star <= rating ? 'text-yellow-500' : 'text-gray-300'
					}`}
					fill='currentColor'
					viewBox='0 0 20 20'
					onClick={() => handleStarClick(star)}>
					<path d='M10 15.27l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L10 3 7.19 8.82 2 9.24l3.46 3.67-1.64 5.09L10 15.27z' />
				</svg>
			))}
		</div>
	);
};

const PurchaseHistory = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [currentProductId, setCurrentProductId] = useState(null);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');

	useEffect(() => {
		const fetchPurchaseHistory = async () => {
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
					'http://localhost:3000/tourists/productHistory',
					config
				);
				setProducts(response.data.products);
			} catch (error) {
				setError('Error fetching purchase history. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchPurchaseHistory();
	}, []);

	const openModal = (productId) => {
		setCurrentProductId(productId);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setRating(0);
		setComment('');
	};

	const handleReviewSubmit = async () => {
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
				'http://localhost:3000/tourists/review',
				{ productId: currentProductId, comment, rating },
				config
			);

			closeModal();
		} catch (error) {
			console.error('Error submitting review:', error);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-300 flex items-center justify-center'>
			<div className='container mx-auto px-6 py-8'>
				<h1 className='text-4xl font-bold text-center text-gray-800 mb-8'>
					Purchase History
				</h1>

				{loading ? (
					<div className='flex justify-center items-center'>
						<div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
					</div>
				) : error ? (
					<div className='text-center text-red-600 text-lg'>{error}</div>
				) : products.length === 0 ? (
					<p className='text-center text-gray-600 text-lg'>
						No products purchased.
					</p>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
						{products.map((product) => (
							<div
								key={product._id}
								className='bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300'>
								<img
									src={`http://localhost:3000/photos/${product.picture}`}
									alt={product.name}
									className='w-full h-48 object-cover'
								/>
								<div className='p-6'>
									<h2 className='text-xl font-bold text-teal-600 mb-2'>
										{product.name}
									</h2>
									<p className='text-gray-700 text-sm mb-4'>
										{product.details}
									</p>
									<button
										onClick={() => openModal(product._id)}
										className='bg-teal-600 text-white w-full py-2 rounded-md hover:bg-teal-700 transition duration-200'>
										Add Review
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{modalOpen && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
						<div className='bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-300  rounded-lg shadow-lg p-6 w-11/12 md:w-96'>
							<h2 className='text-2xl font-bold text-gray-800 mb-4'>
								Add Review
							</h2>
							<div className='mb-4'>
								<label className='block text-gray-700 text-sm font-medium mb-2'>
									Rating
								</label>
								<StarRating
									rating={rating}
									onChange={setRating}
								/>
							</div>
							<div className='mb-4'>
								<label className='block text-gray-700 text-sm font-medium mb-2'>
									Comment
								</label>
								<textarea
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									rows='4'
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
									placeholder='Write your comment here'
								/>
							</div>
							<div className='flex justify-between'>
								<button
									onClick={closeModal}
									className='text-gray-600 hover:text-gray-800'>
									Cancel
								</button>
								<button
									onClick={handleReviewSubmit}
									className='bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition duration-200'>
									Submit Review
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PurchaseHistory;
