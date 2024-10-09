/** @format */

import { useNavigate } from 'react-router-dom';

const Header = () => {
	const navigate = useNavigate();

	return (
		<div className='flex justify-between items-center mb-4'>
			<h1 className='text-4xl font-bold text-blue-900'>
				Welcome to JourneyJot
			</h1>
			<div className='flex space-x-4'>
				<button
					onClick={() => navigate('/signup')}
					className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none'>
					Sign Up
				</button>
				<button
					onClick={() => navigate('/login')}
					className='bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none'>
					Log In
				</button>
			</div>
		</div>
	);
};

export default Header;
