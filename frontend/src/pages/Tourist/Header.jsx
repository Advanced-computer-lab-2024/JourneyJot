/** @format */

// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
	const navigate = useNavigate();

	return (
		<header className='flex justify-between items-center p-4 bg-white shadow-md'>
			<h1 className='text-xl font-semibold text-gray-800'>Tourist Home Page</h1>
			<div className='flex space-x-4'>
				<button
					onClick={() => navigate('/tourist/homePage/points')}
					className='btn btn-primary'>
					Points
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/wallet')}
					className='btn btn-primary'>
					Wallet
				</button>
				<button className='btn btn-primary'>Book Hotel</button>
				<button className='btn btn-primary'>Book Flight</button>
				<button
					onClick={() => navigate('/tourist/homePage/products')}
					className='btn btn-primary'>
					Products
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/reservations')}
					className='btn btn-primary'>
					Reservations
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/complaints')}
					className='btn btn-primary'>
					Complaints
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/change-password')}
					className='btn btn-primary'>
					Change Password
				</button>
				<button
					onClick={() => navigate('/completed')}
					className='btn btn-primary'>
					Completed Activities
				</button>
				<button
					onClick={() => navigate('/tourist/homePage/profile')}
					className='btn btn-primary'>
					My Profile
				</button>
			</div>
		</header>
	);
};

export default Header;
