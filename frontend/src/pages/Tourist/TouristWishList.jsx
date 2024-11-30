/** @format */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TouristWishList = () => {
	const [wishList, setWishList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
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
				setError(err.response ? err.response.data.message : 'Server error');
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
		} catch (err) {
			alert('Failed to remove product from wish list.');
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

			const response = await axios.post(
				`http://localhost:3000/tourists/addToCart/${productId}`,
				{},
				config
			);

			alert('Product added to cart');
		} catch (err) {
			alert('Failed to add product to cart.');
		}
	};

	if (loading) return <div className='text-center mt-10'>Loading...</div>;
	if (error)
		return <div className='text-center text-red-500 mt-10'>{error}</div>;

	return (
		<div className='max-w-7xl mx-auto p-6'>
			<h2 className='text-3xl font-semibold mb-8 text-center text-teal-600'>
				Your Wish List
			</h2>
			{wishList.length === 0 ? (
				<div className='text-center text-gray-500'>
					Your wish list is empty.
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
					{wishList.map((product) => (
						<div
							key={product._id}
							className='relative flex flex-col items-start border border-gray-300 rounded-lg p-5 shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-white hover:bg-gray-50'>
							<img
								src={`http://localhost:3000/photos/${product.picture}`}
								alt={product.name}
								className='w-32 h-32 object-cover rounded-t-lg mb-4' // Adjusted size of product image
							/>
							<div className='mt-4'>
								<h3 className='text-lg font-semibold text-gray-800'>
									{product.name}
								</h3>
								<p className='text-gray-600 mt-2'>
									${product.price.toFixed(2)}
								</p>
							</div>

							<div className='mt-4 w-full flex gap-x-4'>
								<button
									className='bg-red-500 text-white px-4 py-2 text-sm rounded-md shadow-md hover:bg-red-600 focus:outline-none'
									onClick={(e) => {
										e.stopPropagation(); // Prevent navigation when clicking the button
										removeFromWishList(product._id);
									}}>
									Remove
								</button>

								<button
									className='bg-teal-500 text-white px-4 py-2 text-sm rounded-md shadow-md hover:bg-teal-600 focus:outline-none'
									onClick={() =>
										navigate(`/tourist/homePage/products/${product._id}`)
									}>
									View Product
								</button>

								<button
									className='bg-yellow-500 text-white px-4 py-2 text-sm rounded-md shadow-md hover:bg-yellow-600 focus:outline-none'
									onClick={(e) => {
										e.stopPropagation(); // Prevent navigation when clicking the button
										addToCart(product._id);
									}}>
									Add to Cart
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default TouristWishList;
