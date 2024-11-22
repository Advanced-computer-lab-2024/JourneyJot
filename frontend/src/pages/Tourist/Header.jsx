/** @format */

// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
	const navigate = useNavigate();

	return (
		<header className='flex justify-between items-center p-6 bg-opacity-90 backdrop-blur-lg shadow-md rounded-lg'>
			<h1 className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500'>
				Tourist PORTAL
			</h1>
			<div className='flex space-x-4'>
				<button
					onClick={() => navigate('/tourist/homePage/points')}
					className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					Points
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/wallet')}
					className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					Wallet
				</button>
				<button className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					Book Hotel
				</button>
				<button className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					Book Flight
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/products')}
					className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					Products
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/reservations')}
					className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					Reservations
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/complaints')}
					className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					Complaints
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/change-password')}
					className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					Change Password
				</button>
				<button
					onClick={() => navigate('/completed')}
					className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					view completed activities
				</button>

				<button
					onClick={() => navigate('/tourist/homePage/profile')}
					className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					My Profile
				</button>
				<button
					onClick={() => navigate('/forget-password')}
					className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
					Forget password?
				</button>
				{/* Link to the Forgot Password page */}
			</div>
		</header>
	);
};

export default Header;
