/** @format */

import { useNavigate } from 'react-router-dom';

const Header = () => {
	const navigate = useNavigate();

	return (
		<div className='flex justify-between items-center p-4 bg-white shadow-md'>
			<h1 className='text-3xl font-extrabold text-blue-900 md:text-4xl'>
				Welcome to JourneyJot
			</h1>
			<div className='flex space-x-4'>
				<button
					onClick={() => navigate('/signup')}
					className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200'>
					Sign Up
				</button>
				<button
					onClick={() => navigate('/login')}
					className='bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-200'>
					Log In
				</button>
			</div>
		</div>
	);
};

export default Header;
