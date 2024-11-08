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
		<div className='h-screen flex flex-col items-center justify-center p-4'>
			{loading && <Spinner />}
			<div className='flex flex-col space-y-4'>
				<input
					type='text'
					placeholder='Product Name'
					value={productName}
					onChange={(e) => setProductName(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl'
				/>
				<input
					type='text'
					placeholder='Product Details'
					value={productDetails}
					onChange={(e) => setProductDetails(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl'
				/>
				<input
					type='text'
					placeholder='Price'
					value={productPrice}
					onChange={(e) => setProductPrice(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl'
				/>
				<input
					type='text'
					placeholder='Quantity'
					value={productQuantity}
					onChange={(e) => setProductQuantity(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl'
				/>

				{/* Image File Input */}
				<input
					type='file'
					accept='image/*' // Accept only image files
					onChange={(e) => setProductPicture(e.target.files[0])}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl'
				/>

				<input
					type='text'
					placeholder='Rating (0-5)'
					value={productRating}
					onChange={(e) => setProductRating(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl'
				/>
			</div>
			<div className='mt-4'>
				<button
					className='bg-teal-500 text-white rounded-md px-6 py-2 shadow-md hover:bg-teal-600 transition duration-200'
					onClick={handleSaveProduct}>
					Add Product
				</button>
			</div>
		</div>
	);
};

export default AddProduct;
