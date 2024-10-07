/** @format */

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductCard = ({ products = [] }) => {
	console.log('Products passed to ProductCard:', products);

	return (
		<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{products.length > 0 ? (
				products.map((product) => (
					<div
						key={product._id}
						className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover: shadow-xl'>
						<div className='flex flex-col justify-between h-full'>
							<h2 className='text-xl font-bold'>{product.details}</h2>
							<p className='text-gray-700'>Price: ${product.price}</p>
							<p className='text-gray-700'>Quantity: {product.quantity}</p>
							<p className='text-gray-700'>Rating: {product.rating}</p>
							<Link to={`editProduct/${product._id}`}>
								<button className='bg-teal-500 rounded-md w-24 mt-2'>
									Edit
								</button>
							</Link>
						</div>
					</div>
				))
			) : (
				<p>No products Available</p>
			)}
		</div>
	);
};

// Define PropTypes for your component
ProductCard.propTypes = {
	products: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired, // Ensures _id is a string and required
			details: PropTypes.string.isRequired, // Ensures details is a string and required
			price: PropTypes.number.isRequired, // Ensures price is a number and required
			quantity: PropTypes.number.isRequired, // Ensures quantity is a number and required
			rating: PropTypes.number.isRequired, // Ensures rating is a number and required
		})
	).isRequired, // Ensures products is an array and required
};

export default ProductCard;
