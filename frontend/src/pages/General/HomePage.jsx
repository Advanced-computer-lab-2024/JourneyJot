/** @format */

import { Link } from 'react-router-dom';

const HomePage = () => {
	return (
		<div className='flex justify-center space-x-4 mt-10'>
			<Link to={'/products'}>
				<button className='bg-green-500 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-green-600 transition duration-200'>
					View Products
				</button>
			</Link>
			<Link to={'/tour-guide/profile'}>
				<button className='bg-green-500 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-green-600 transition duration-200'>
					View Profile
				</button>
			</Link>
			<div className='mt-4 text-center'>
				<Link to='/'>
					<span className='text-indigo-600 hover:text-indigo-800 transition-all duration-200'>
						Home Page
					</span>
				</Link>
			</div>
		</div>
	);
};

export default HomePage;
