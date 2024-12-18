/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/General/Spinner';
import TouristProductCard from '../../components/Tourist/TouristProductCard';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TouristProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [sort, setSort] = useState(false);
	const [searchedProduct, setSearchedProduct] = useState('');
	const [rates, setRates] = useState({});
	const [selectedCurrency, setSelectedCurrency] = useState('USD');
	const [conversionRate, setConversionRate] = useState(1);
	const navigate = useNavigate();

	useEffect(() => {
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

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const response = await axios.get('http://localhost:3000/products/show');
			setProducts(response.data.products);
		} catch (error) {
			console.error('Error fetching data: ', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		if (!sort) {
			fetchProducts();
		} else {
			axios
				.get('http://localhost:3000/products/sortProducts')
				.then((response) => {
					setProducts(response.data.products);
				})
				.catch((error) => {
					console.error('Error fetching data: ', error);
				})
				.finally(() => setLoading(false));
		}
	}, [sort]);

	const filterByPrice = () => {
		setLoading(true);
		axios
			.get('http://localhost:3000/products/filterProductsByPrice', {
				params: { minPrice, maxPrice },
			})
			.then((response) => {
				setProducts(response.data.products);
			})
			.catch((error) => {
				console.error('Error filtering data: ', error);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (searchedProduct.trim()) {
			setLoading(true);
			axios
				.get('http://localhost:3000/products/searchProductByName', {
					params: { productName: searchedProduct },
				})
				.then((response) => {
					setProducts(response.data.products);
				})
				.catch((error) => {
					console.error('Error fetching data: ', error);
				})
				.finally(() => setLoading(false));
		} else {
			fetchProducts();
		}
	}, [searchedProduct]);

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-8'>
			<div className='flex items-start min-w-full'>
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
			</div>
			{/* Header */}
			<div className='flex flex-col md:flex-row justify-between items-center mb-8 space-y-6 md:space-y-0'>
				<h1 className='text-4xl font-extrabold text-teal-600'>
					Explore Products
				</h1>
				<div className='flex flex-col md:flex-row items-center space-x-4 md:space-x-6 w-full md:w-auto'>
					<div className='flex items-center space-x-2'>
						<label
							htmlFor='currency-select'
							className='text-sm font-medium text-gray-700'>
							Currency:
						</label>
						<select
							id='currency-select'
							value={selectedCurrency}
							onChange={handleCurrencyChange}
							className='rounded-lg border-gray-300 px-4 py-2 text-sm bg-white shadow-sm focus:ring-teal-400 focus:border-teal-400 transition'>
							{Object.keys(rates).map((currency) => (
								<option
									key={currency}
									value={currency}>
									{currency}
								</option>
							))}
						</select>
					</div>
					<button
						className='bg-teal-500 text-white rounded-lg px-6 py-2 shadow hover:bg-teal-600 transition'
						onClick={() => setSort((prevState) => !prevState)}>
						{sort ? 'Unsort' : 'Sort by Rating'}
					</button>
					<input
						type='search'
						placeholder='Search products...'
						value={searchedProduct}
						onChange={(e) => setSearchedProduct(e.target.value)}
						className='w-full md:w-auto max-w-md rounded-lg border-gray-300 px-4 py-2 shadow focus:ring-teal-400 focus:border-teal-400 transition'
					/>
				</div>
			</div>

			{/* Cart Icon */}
			<div className='fixed bottom-6 right-6 z-50'>
				<Link to='/tourist/homePage/products/cart'>
					<FaShoppingCart
						size={32}
						className='text-gray-700 hover:text-teal-500 transition duration-200'
					/>
				</Link>
			</div>

			{/* Filters */}
			<div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8'>
				<input
					placeholder='Min Price'
					className='rounded-lg border-gray-300 px-4 py-2 text-sm shadow focus:ring-teal-400 focus:border-teal-400 transition'
					value={minPrice}
					onChange={(e) => setMinPrice(e.target.value)}
				/>
				<input
					placeholder='Max Price'
					className='rounded-lg border-gray-300 px-4 py-2 text-sm shadow focus:ring-teal-400 focus:border-teal-400 transition'
					value={maxPrice}
					onChange={(e) => setMaxPrice(e.target.value)}
				/>
				<button
					onClick={filterByPrice}
					className='bg-teal-500 text-white rounded-lg px-6 py-2 shadow hover:bg-teal-600 transition'>
					Filter
				</button>
			</div>

			{/* Navigation Links */}
			<div className='flex flex-col md:flex-row md:justify-center space-y-4 md:space-y-0 md:space-x-6 mb-8'>
				<Link
					to='/tourist/homePage/products/purchase-history'
					className='text-teal-600 font-medium hover:underline'>
					View Purchase History
				</Link>
				<Link
					to='/tourist/homePage/products/wishlist'
					className='text-teal-600 font-medium hover:underline'>
					View Wish List
				</Link>
				<Link
					to='/tourist-cart'
					className='text-teal-600 font-medium hover:underline'>
					View Cart
				</Link>
				<Link
					to='/tourist-orders'
					className='text-teal-600 font-medium hover:underline'>
					Orders
				</Link>
			</div>

			{/* Product List */}
			<div>
				{loading ? (
					<Spinner />
				) : (
					<TouristProductCard
						products={products}
						currency={selectedCurrency}
						conversionRate={conversionRate}
					/>
				)}
			</div>
		</div>
	);
};

export default TouristProducts;
