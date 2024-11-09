/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/General/Spinner';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/Products/ProductCard';

const ShowProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [sort, setSort] = useState(false);
	const [searchedProduct, setSearchedProduct] = useState('');

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
		<div className='p-6 bg-gray-50 min-h-screen'>
			<div className='flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0'>
				{/* Header and search bar */}
				<h1 className='text-3xl font-bold text-teal-600'>Products</h1>
				<div className='flex space-x-4 items-center justify-end w-3/4'>
					{/* Add Product button */}
					<Link to={'addProduct'}>
						<button className='bg-teal-500 text-white rounded-md px-6 py-2 shadow-md hover:bg-teal-600 transition duration-200'>
							Add Product
						</button>
					</Link>
					{/* Sort By Rating button */}
					<button
						className='bg-teal-500 text-white rounded-md px-6 py-2 shadow-md hover:bg-teal-600 transition duration-200'
						onClick={() => setSort((prevState) => !prevState)}>
						Sort By Rating
					</button>
					{/* Search bar */}
					<input
						type='search'
						placeholder='Search...'
						value={searchedProduct}
						onChange={(e) => setSearchedProduct(e.target.value)}
						className='w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400'
					/>
				</div>
			</div>

			<div className='flex space-x-4 justify-end mb-4'>
				{/* Min Price input */}
				<input
					placeholder='Min Price'
					className='border border-gray-300 rounded-lg p-2 w-1/4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
					value={minPrice}
					onChange={(e) => setMinPrice(e.target.value)}
				/>
				{/* Max Price input */}
				<input
					placeholder='Max Price'
					className='border border-gray-300 rounded-lg p-2 w-1/4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
					value={maxPrice}
					onChange={(e) => setMaxPrice(e.target.value)}
				/>
				{/* Filter button */}
				<button
					onClick={filterByPrice}
					className='bg-teal-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-teal-600 transition duration-200'>
					Filter
				</button>
			</div>

			<div className='mb-4'>
				{/* Display loading spinner or products */}
				{loading ? <Spinner /> : <ProductCard products={products} />}
			</div>
		</div>
	);
};

export default ShowProducts;
