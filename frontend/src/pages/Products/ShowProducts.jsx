/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/General/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/Products/ProductCard';

const ShowProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [sort, setSort] = useState(false);
	const [searchedProduct, setSearchedProduct] = useState('');
	const navigate = useNavigate();

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
			const response = await axios.get('http://localhost:3000/products/', {
				headers: {
					Authorization: `Bearer ${token}`, // Send the token in the request header
				},
			});
			setProducts(response.data.products);
			console.log('Fetched products:', response.data); // Check the product data, including image paths
		} catch (error) {
			console.error('Error fetching data: ', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Fetch products when the component mounts or when sort changes
		if (!sort) {
			fetchProducts();
		} else {
			axios
				.get('http://localhost:3000/products/sortProducts')
				.then((response) => {
					setProducts(response.data.products);
					console.log('Fetched sorted products:', response.data); // Check sorted product data
				})
				.catch((error) => {
					console.error('Error fetching sorted products: ', error);
				})
				.finally(() => setLoading(false));
		}
	}, [sort]);

	const filterByPrice = () => {
		setLoading(true);
		axios
			.get('http://localhost:3000/products/filterProductsByPrice', {
				params: { minPrice: minPrice, maxPrice: maxPrice },
			})
			.then((response) => {
				setProducts(response.data.products);
				console.log('Filtered products by price:', response.data); // Check filtered products
			})
			.catch((error) => {
				console.error('Error filtering data: ', error);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		// Handle searching products by name
		if (searchedProduct.trim()) {
			setLoading(true);
			axios
				.get('http://localhost:3000/products/searchProductByName', {
					params: { productName: searchedProduct },
				})
				.then((response) => {
					setProducts(response.data.products);
					console.log('Fetched searched products:', response.data); // Check searched products
				})
				.catch((error) => {
					console.error('Error fetching searched products: ', error);
				})
				.finally(() => setLoading(false));
		} else {
			fetchProducts();
		}
	}, [searchedProduct]);

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 flex flex-col justify-center items-center py-8'>
			{/* Header and Search */}
			<div className='flex flex-col md:flex-row justify-between items-center mb-6 w-full px-4'>
				<button
					onClick={() => navigate(-1)}
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
				<h1 className='text-4xl font-semibold text-teal-700 mb-4 md:mb-0'>
					Products
				</h1>
				<div className='flex flex-wrap gap-4 items-center justify-end w-full md:w-3/4'>
					<Link to='addProduct'>
						<button className='bg-teal-600 text-white rounded-lg px-6 py-3 shadow-lg hover:bg-teal-700 transition duration-200 w-full sm:w-auto'>
							Add Product
						</button>
					</Link>
					<button
						className='bg-teal-600 text-white rounded-lg px-6 py-3 shadow-lg hover:bg-teal-700 transition duration-200 w-full sm:w-auto'
						onClick={() => setSort((prevState) => !prevState)}>
						Sort By Rating
					</button>
					<input
						type='search'
						placeholder='Search Products...'
						value={searchedProduct}
						onChange={(e) => setSearchedProduct(e.target.value)}
						className='w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500'
					/>
				</div>
			</div>

			{/* Price Filter */}
			<div className='flex flex-wrap justify-end gap-4 mb-6 w-full px-4'>
				<input
					placeholder='Min Price'
					className='border border-gray-300 rounded-lg p-3 w-full sm:w-1/4 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500'
					value={minPrice}
					onChange={(e) => setMinPrice(e.target.value)}
				/>
				<input
					placeholder='Max Price'
					className='border border-gray-300 rounded-lg p-3 w-full sm:w-1/4 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500'
					value={maxPrice}
					onChange={(e) => setMaxPrice(e.target.value)}
				/>
				<button
					onClick={filterByPrice}
					className='bg-teal-600 text-white rounded-lg px-6 py-3 shadow-lg hover:bg-teal-700 transition duration-200 w-full sm:w-auto'>
					Filter
				</button>
			</div>

			{/* Display Products or Spinner */}
			<div className='w-full px-4'>
				{loading ? (
					<div className='flex justify-center items-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600'></div>
					</div>
				) : (
					<ProductCard products={products} />
				)}
			</div>
		</div>
	);
};

export default ShowProducts;
