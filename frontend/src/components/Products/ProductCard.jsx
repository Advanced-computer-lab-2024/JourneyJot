/** @format */

import { Link } from 'react-router-dom';

const ProductCard = ({ products = [] }) => {
	// Function to render stars based on rating
	const renderStars = (rating) => {
		const totalStars = 5;
		return (
			<div className='flex'>
				{Array.from({ length: totalStars }, (_, index) => (
					<svg
						key={index}
						className={`w-5 h-5 ${
							index < rating ? 'text-yellow-500' : 'text-gray-300'
						}`}
						fill='currentColor'
						viewBox='0 0 20 20'
						xmlns='http://www.w3.org/2000/svg'>
						<path d='M9.049 2.927a1 1 0 011.902 0l1.715 4.801a1 1 0 00.95.69h5.033a1 1 0 01.612 1.79l-4.07 2.959a1 1 0 00-.364 1.118l1.715 4.801a1 1 0 01-1.536 1.118L10 15.347l-4.365 3.171a1 1 0 01-1.536-1.118l1.715-4.801a1 1 0 00-.364-1.118L1.38 9.208a1 1 0 01.612-1.79h5.033a1 1 0 00.95-.69l1.715-4.801z' />
					</svg>
				))}
			</div>
		);
	};

	// Function to format price with commas
	const formatPrice = (price) => {
		return price.toLocaleString(); // Format the price with commas
	};

	return (
		<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
			{products.length > 0 ? (
				products.map((product) => (
					<div
						key={product._id}
						className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-lg transition duration-300 ease-in-out'>
						<div className='flex flex-col justify-between h-full'>
							{product.picture ? (
								<>
									<img
										src={product.picture}
										className='w-full h-full object-cover rounded-t-lg'
									/>
								</>
							) : (
								<div className='w-full h-full bg-gray-300 flex justify-center items-center rounded-t-lg'>
									<span className='text-gray-600'>No Image Available</span>
								</div>
							)}

							<h2 className='text-xl font-semibold text-gray-800'>
								{product.name}
							</h2>
							<p className='text-gray-700'>{product.details}</p>
							<p className='text-gray-700'>
								Price: ${formatPrice(product.price)}
							</p>
							<p className='text-gray-700'>Quantity: {product.quantity}</p>

							<p className='text-gray-700'>Rating:</p>
							<div className='flex items-center'>
								{renderStars(Math.round(product.rating) || 0)}{' '}
								{/* Render stars based on rating */}
							</div>

							<Link to={`editProduct/${product._id}`}>
								<button className='bg-teal-500 text-white rounded-md w-24 mt-4 py-2 text-sm'>
									Edit
								</button>
							</Link>
						</div>
					</div>
				))
			) : (
				<p className='col-span-full text-center text-gray-500'>
					No products available
				</p>
			)}
		</div>
	);
};

export default ProductCard;
