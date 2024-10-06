/** @format */

import { useState } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
	const [ProductDetails, setProductDetails] = useState('');
	const [productPrice, setProductPrice] = useState('');
	const [productQuantity, setProductQuantity] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleSaveProduct = () => {
		const data = {
			details: ProductDetails,
			price: parseInt(productPrice),
			quantity: parseInt(productQuantity),
		};
		setLoading(true);
		axios
			.post('http://localhost:3000/products/addProduct', data)
			.then(() => {
				setLoading(false);
				navigate('/products');
			})
			.catch((err) => {
				setLoading(false);
				alert('error, check console!');
				console.log(err.response.data);
			});
	};

	return (
		<div className='h-screen flex flex-col items-center justify-center'>
			{loading ? <Spinner /> : ''}
			<div className='flex justify-center'>
				<input
					type='text'
					placeholder='Product Name'
					value={ProductDetails}
					onChange={(e) => setProductDetails(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover: shadow-xl'
				/>
				<input
					type='text'
					placeholder='Price'
					value={productPrice}
					onChange={(e) => setProductPrice(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover: shadow-xl'
				/>
				<input
					type='text'
					placeholder='Quantity'
					value={productQuantity}
					onChange={(e) => setProductQuantity(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover: shadow-xl'
				/>
			</div>
			<div>
				<button
					className='bg-teal-500 rounded-md px-6'
					onClick={handleSaveProduct}>
					Add Product
				</button>
			</div>
		</div>
	);
};

export default AddProduct;
