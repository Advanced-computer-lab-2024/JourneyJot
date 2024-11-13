/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/General/Spinner';
import TouristProductCard from '../../components/Tourist/TouristProductCard';
import { Link } from 'react-router-dom'; // Import Link for navigation

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

	useEffect(() => {
		// Fetch exchange rates
		axios
			.get(
				'https://v6.exchangerate-api.com/v6/14c4008744f504c874fd1f25/latest/USD'
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
			console.log('Fetched products:', response.data);
		} catch (error) {
			console.error('Error fetching data: ', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// sort and unsort products
		setLoading(true);
		if (!sort) {
			fetchProducts();
		} else {
			axios
				.get('http://localhost:3000/products/sortProducts')
				.then((response) => {
					setProducts(response.data.products);
					console.log('Fetched sorted products:', response.data);
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
				params: { minPrice: minPrice, maxPrice: maxPrice },
			})
			.then((response) => {
				setProducts(response.data.products);
				console.log('Filtered products by price:', response.data);
			})
			.catch((error) => {
				console.error('Error filtering data: ', error);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		// handle if user is searching for something
		if (searchedProduct.trim()) {
			setLoading(true);
			axios
				.get('http://localhost:3000/products/searchProductByName', {
					params: { productName: searchedProduct },
				})
				.then((response) => {
					setProducts(response.data.products);
					console.log('Fetched searched products:', response.data);
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
		<div className='p-6 bg-gray-50 min-h-screen'>
			<div className='flex flex-col md:flex-row justify-between items-center mb-4'>
				<h1 className='text-3xl font-bold text-teal-600'>Products</h1>
				<div className='flex space-x-4 w-1/2 justify-end'>
					<label htmlFor='currency-select'>Select Currency:</label>
					<select
						id='currency-select'
						value={selectedCurrency}
						onChange={handleCurrencyChange}>
						{Object.keys(rates).map((currency) => (
							<option
								key={currency}
								value={currency}>
								{currency}
							</option>
						))}
					</select>

					<button
						className='bg-teal-500 text-white rounded-md px-6 py-2 mt-4 md:mt-0 shadow-md hover:bg-teal-600 transition duration-200'
						onClick={() => setSort((prevState) => !prevState)}>
						Sort By Rating
					</button>
					<input
						type='search'
						placeholder='Search...'
						value={searchedProduct}
						onChange={(e) => setSearchedProduct(e.target.value)}
						className='mt-4 md:mt-0 w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400'
					/>
				</div>
			</div>

			{/* Price Filters */}
			<div className='flex flex-col md:flex-row items-center mt-4 mb-4'>
				<input
					placeholder='Min Price'
					className='border border-gray-300 rounded-lg m-2 p-2 w-full md:w-1/4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
					value={minPrice}
					onChange={(e) => setMinPrice(e.target.value)}
				/>
				<input
					placeholder='Max Price'
					className='border border-gray-300 rounded-lg m-2 p-2 w-full md:w-1/4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
					value={maxPrice}
					onChange={(e) => setMaxPrice(e.target.value)}
				/>
				<button
					onClick={filterByPrice}
					className='bg-teal-500 text-white rounded-md px-4 py-2 mt-4 md:mt-0 shadow-md hover:bg-teal-600 transition duration-200 w-full md:w-1/4'>
					Filter
				</button>
			</div>

			{/* Link to Purchase History */}
			<div className='mb-4 text-center'>
				<Link
					to='/tourist/homePage/products/purchase-history' // Ensure this is the correct route
					className='text-teal-600 hover:text-teal-800 font-semibold transition duration-200'>
					View Purchase History
				</Link>
			</div>

			<div className='mb-4'>
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
