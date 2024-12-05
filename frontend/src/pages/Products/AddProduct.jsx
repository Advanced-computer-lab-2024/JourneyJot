/** @format */

import { useState } from 'react';
import Spinner from '../../components/General/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
	const [productName, setProductName] = useState('');
	const [productDetails, setProductDetails] = useState('');
	const [productPrice, setProductPrice] = useState('');
	const [productQuantity, setProductQuantity] = useState('');
	const [productPicture, setProductPicture] = useState(null); // File to upload
	const [productRating, setProductRating] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSaveProduct = () => {
		// Prepare the data for product creation (without picture)
		const productData = {
			name: productName,
			details: productDetails,
			price: parseFloat(productPrice),
			quantity: parseInt(productQuantity),
			rating: parseFloat(productRating),
		};

		setLoading(true);

		// Step 1: Save product without the picture
		axios
			.post('http://localhost:3000/products/addProduct', productData)
			.then((response) => {
				// Step 2: Get product ID from response (ensure it's being returned correctly)
				const productId = response.data._id; // Ensure the correct product ID is returned from the backend

				if (!productId) {
					// If no productId is returned, show an error and return
					alert('Product creation failed, no product ID received.');
					setLoading(false);
					return;
				}

				// Step 3: If a picture is selected, upload the image
				if (productPicture) {
					const formData = new FormData();
					formData.append('picture', productPicture); // Append the image file

					// Upload the image to the upload route
					axios
						.post(
							`http://localhost:3000/products/${productId}/upload`, // Ensure productId is properly set here
							formData,
							{
								headers: {
									'Content-Type': 'multipart/form-data', // Important for file uploads
								},
							}
						)
						.then(() => {
							setLoading(false);
							navigate('/products'); // Navigate to products page after success
						})
						.catch((err) => {
							setLoading(false);
							alert('Error uploading image, check console!');
							console.log(err.response.data);
						});
				} else {
					setLoading(false);
					navigate('/products'); // Navigate to products page if no image is uploaded
				}
			})
			.catch((err) => {
				setLoading(false);
				alert('Error saving product, check console!');
				console.log(err.response.data);
			});
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='w-full max-w-lg bg-white rounded-lg shadow-lg p-6'>
				{loading && (
					<div className='flex justify-center mb-4'>
						<Spinner />
					</div>
				)}
				<h1 className='text-2xl font-bold text-gray-800 text-center mb-6'>
					Add Product
				</h1>
				<form className='flex flex-col space-y-4'>
					{/* Product Name */}
					<input
						type='text'
						placeholder='Product Name'
						value={productName}
						onChange={(e) => setProductName(e.target.value)}
						className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none'
					/>

					{/* Product Details */}
					<textarea
						placeholder='Product Details'
						value={productDetails}
						onChange={(e) => setProductDetails(e.target.value)}
						className='border border-gray-300 rounded-lg px-4 py-2 resize-none focus:ring-2 focus:ring-indigo-400 focus:outline-none'
						rows='3'
					/>

					{/* Price */}
					<input
						type='text'
						placeholder='Price'
						value={productPrice}
						onChange={(e) => setProductPrice(e.target.value)}
						className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none'
					/>

					{/* Quantity */}
					<input
						type='text'
						placeholder='Quantity'
						value={productQuantity}
						onChange={(e) => setProductQuantity(e.target.value)}
						className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none'
					/>

					{/* Image File Input */}
					<div className='flex flex-col'>
						<label className='text-sm text-gray-600 mb-1'>
							Upload Product Image:
						</label>
						<input
							type='file'
							accept='image/*'
							onChange={(e) => setProductPicture(e.target.files[0])}
							className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none'
						/>
					</div>

					{/* Rating */}
					<input
						type='text'
						placeholder='Rating (0-5)'
						value={productRating}
						onChange={(e) => setProductRating(e.target.value)}
						className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none'
					/>

					{/* Submit Button */}
					<button
						type='button'
						className='bg-teal-500 text-white rounded-lg px-6 py-2 mt-4 shadow hover:bg-teal-600 transition duration-200'
						onClick={handleSaveProduct}>
						Add Product
					</button>
				</form>
			</div>
		</div>
	);
};

export default AddProduct;
