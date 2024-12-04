/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const token = localStorage.getItem('token'); // Retrieve the token from localStorage
				const response = await axios.get('http://localhost:3000/products', {
					headers: {
						Authorization: `Bearer ${token}`, // Add the token to request headers
					},
				});
				setProducts(response.data.products); // Store products in state
			} catch (err) {
				setError(
					err.response ? err.response.data.message : 'Error fetching products'
				);
				console.error('Error fetching data:', err);
			}
		};

		fetchProducts(); // Call the function
	}, []);

	const handleArchive = async (id) => {
		try {
			const response = await axios.put(
				`http://localhost:3000/products/archive/${id}`
			);
			alert(response.data.message);
			setProducts(
				products.map((p) => (p._id === id ? { ...p, archived: true } : p))
			);
		} catch (err) {
			console.error('Error archiving product', err);
		}
	};

	const handleUnarchive = async (id) => {
		try {
			const response = await axios.put(
				`http://localhost:3000/products/unarchive/${id}`
			);
			alert(response.data.message);
			setProducts(
				products.map((p) => (p._id === id ? { ...p, archived: false } : p))
			);
		} catch (err) {
			console.error('Error unarchiving product', err);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='max-w-7xl mx-auto px-6 py-8'>
				{/* Error Message */}
				{error && <p className='text-red-500 text-center mb-6'>{error}</p>}

				{/* Heading */}
				<h1 className='text-4xl font-semibold mb-8 text-center text-teal-700'>
					Product List
				</h1>

				{/* Table Wrapper */}
				<div className='overflow-x-auto bg-white shadow-xl rounded-lg'>
					<table className='min-w-full divide-y divide-gray-200'>
						{/* Table Header */}
						<thead className='bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-300'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Name
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Price
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Quantity
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Sales
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Action
								</th>
							</tr>
						</thead>

						{/* Table Body */}
						<tbody className='bg-white divide-y divide-gray-200'>
							{products.map((product) => (
								<tr key={product._id}>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
										{product.name}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										${product.price}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{product.quantity}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{product.sales || 0}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
										{product.archived ? (
											<button
												onClick={() => handleUnarchive(product._id)}
												className='inline-flex items-center px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
												Unarchive
											</button>
										) : (
											<button
												onClick={() => handleArchive(product._id)}
												className='inline-flex items-center px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
												Archive
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProductList;
