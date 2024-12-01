/** @format */
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Spinner from '../../components/General/Spinner';

const EditProduct = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [productName, setProductName] = useState('');
	const [productDetails, setProductDetails] = useState('');
	const [productPrice, setProductPrice] = useState('');
	const [productQuantity, setProductQuantity] = useState('');
	const [productPicture, setProductPicture] = useState(null); // Changed to null to handle file upload
	const [productRating, setProductRating] = useState('');
	const [loading, setLoading] = useState(true);
	const [existingPicture, setExistingPicture] = useState(''); // To store the existing picture URL

	useEffect(() => {
		// Fetch the product details
		const fetchProduct = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/products/${id}`
				);
				const product = response.data.product;

				// Set the state with fetched product details
				setProductName(product.name);
				setProductDetails(product.details);
				setProductPrice(product.price);
				setProductQuantity(product.quantity);
				setProductRating(product.rating);

				// Check if there is an existing picture and store it
				setExistingPicture(product.picture); // Assuming 'picture' holds the URL or path to the product picture
			} catch (err) {
				alert('Error, check console!');
				console.log(err.response.data);
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	const handleEditProduct = async () => {
		const data = {
			name: productName,
			details: productDetails,
			price: parseFloat(productPrice), // Use parseFloat for price
			quantity: parseInt(productQuantity),
			rating: parseFloat(productRating), // Use parseFloat for rating
		};

		setLoading(true);
		try {
			// Step 1: Update the product details (without the picture first)
			const response = await axios.put(
				`http://localhost:3000/products/${id}`,
				data
			);

			// Step 2: If a new picture is uploaded, send the picture
			if (productPicture) {
				const formData = new FormData();
				formData.append('picture', productPicture); // Attach the image

				await axios.post(
					`http://localhost:3000/products/${id}/upload`, // Ensure productId is correctly set
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data', // Important for file uploads
						},
					}
				);
			}

			setLoading(false);
			navigate('/products');
		} catch (err) {
			setLoading(false);
			alert('Error, check console!');
			console.log(err.response.data);
		}
	};

	return (
		<div className='h-screen flex flex-col items-center justify-center p-4'>
			{loading && <Spinner />}
			<h1>Edit Product</h1>
			<div className='flex flex-col space-y-4'>
				<input
					type='text'
					placeholder='Product Name'
					value={productName}
					onChange={(e) => setProductName(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl'
				/>
				<textarea
					placeholder='Product Details'
					value={productDetails}
					onChange={(e) => setProductDetails(e.target.value)}
					className='border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl resize-none'
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
					onChange={(e) => setProductPicture(e.target.files[0])} // Set the file as state
					className='border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl'
				/>

				{/* If there is an existing picture, show a preview */}
				{existingPicture && !productPicture && (
					<div className='mt-2'>
						<p>Current Picture:</p>
						<img
							src={`http://localhost:3000${existingPicture}`} // Assuming the picture path is relative
							alt='Current Product'
							className='w-32 h-32 object-cover'
						/>
					</div>
				)}

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
					onClick={handleEditProduct}>
					Save
				</button>
			</div>
		</div>
	);
};

export default EditProduct;
