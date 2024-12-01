/** @format */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GovernorDashBoard = () => {
	return (
		<div className='min-h-screen bg-gray-100'>
			{/* Navigation Bar */}
			<nav className='bg-white shadow-md'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<h1 className='text-2xl font-semibold text-gray-800'>
						Governor Dashboard
					</h1>
					<div className='flex space-x-6'>
						<Link
							to='/tourism-governor'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							Attractions
						</Link>
						<Link
							to='/forgot-password'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							forgot Password?
						</Link>
						<Link
							to='/attraction-revenue'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							Attraction Revenue
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-6 py-8'>
				{/* Add content for the dashboard here */}
				<h2 className='text-xl'>Welcome to the Governor Dashboard!</h2>
			</div>
		</div>
	);
};

export default GovernorDashBoard;
