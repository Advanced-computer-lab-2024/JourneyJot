/** @format */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiBookmark } from 'react-icons/fi';
import { MdPayment } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TouristWishList = () => {
	const [wishList, setWishList] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchWishList = async () => {
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
					'http://localhost:3000/tourists/getWishList',
					config
				);
				setWishList(response.data);
			} catch (err) {
				const errorMessage =
					err.response?.data?.message ||
					'Server error while fetching wish list.';
				toast.error(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchWishList();
	}, []);

	// Remove a product from the wish list
	const removeFromWishList = async (productId) => {
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

			await axios.delete(
				`http://localhost:3000/tourists/removeFromWishList/${productId}`,
				config
			);

			setWishList((prevWishList) =>
				prevWishList.filter((product) => product._id !== productId)
			);

			toast.success('Product removed from wish list successfully!');
		} catch (err) {
			const errorMessage =
				err.response?.data?.message ||
				'Failed to remove product from wish list. Please try again.';
			toast.error(errorMessage);
			console.error('Error removing product from wish list:', err);
		}
	};

	// Add a product to the cart
	const addToCart = async (productId) => {
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

			await axios.post(
				`http://localhost:3000/tourists/addToCart/${productId}`,
				{},
				config
			);

			toast.success('Product added to cart successfully!');
		} catch (err) {
			const errorMessage =
				err.response?.data?.message ||
				'Failed to add product to cart. Please try again.';
			toast.error(errorMessage);
			console.error('Error adding product to cart:', err);
		}
	};

	if (loading)
		return <div className='text-center mt-10 text-xl'>Loading...</div>;

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center relative'>
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
					stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M15 19l-7-7 7-7'
					/>
				</svg>
			</button>

			<div className='max-w-7xl mx-auto p-8 w-full'>
				<h2 className='text-4xl font-bold mb-12 text-center text-white'>
					Your Wish List
				</h2>
				{wishList.length === 0 ? (
					<div className='text-center text-gray-200 text-xl'>
						Your wish list is empty.
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
						{wishList.map((product) => (
							<div
								key={product._id}
								className='relative flex flex-col items-start border border-gray-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:bg-gray-50'>
								{/* Image inside the card with proper alignment */}
								<div className='w-full h-48 mb-6 overflow-hidden rounded-lg'>
									<img
										src={`http://localhost:3000/photos/${product.picture}`}
										alt={product.name}
										className='w-full h-full object-cover transition-transform transform hover:scale-105'
									/>
								</div>

								<div className='flex flex-col justify-between flex-grow mb-4'>
									<h3 className='text-xl font-semibold text-gray-800 truncate'>
										{product.name}
									</h3>
									<p className='text-lg text-gray-600 mt-2'>
										${product.price.toFixed(2)}
									</p>
								</div>

								<div className='mt-6 flex flex-col space-y-2'>
									<button
										onClick={() => removeFromWishList(product._id)}
										className='flex-1 bg-red-600 text-white py-3 text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all'
										aria-label='Remove from Wish List'>
										Remove
									</button>

									<button
										onClick={() => addToCart(product._id)}
										className='flex-1 bg-yellow-600 text-white py-3 text-sm font-semibold rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all'
										aria-label='Add to Cart'>
										Add to Cart
									</button>
								</div>

								{/* Bookmark Icon */}
								<div className='absolute top-4 right-4'>
									<button
										onClick={() => addToCart(product._id)}
										className='text-blue-500 hover:text-blue-700 transition-colors duration-200'
										aria-label='Add to Cart'>
										<FiBookmark size={24} />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default TouristWishList;
