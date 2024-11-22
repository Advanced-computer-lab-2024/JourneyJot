/** @format */

import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const TourismGovernorDashboard = () => {
	const navigate = useNavigate();
	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Navbar */}
			<nav className='bg-white shadow-lg'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<div className='flex items-center space-x-2'>
						<FaUserCircle className='text-3xl text-gray-600' />{' '}
						{/* Profile icon */}
						<span className='text-lg font-medium text-gray-700'>Profile</span>
					</div>
					<div className='flex items-center space-x-4'>
						<h1 className='text-2xl font-extrabold text-gray-800'>
							Tourism Governor Dashboard
						</h1>
					</div>
					<div className='space-x-8'>
						<Link
							to='/change-password'
							className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
							Change Password
						</Link>
					</div>
					<Link
						to='/forgot-password'
						className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
						Forget Password
					</Link>
				</div>
			</nav>

			{/* Dashboard Content */}
			<div className='max-w-7xl mx-auto px-6 py-10'>
				<div className='bg-white shadow-md rounded-lg p-6'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Welcome, Tourism Governor
					</h2>
				</div>
			</div>
		</div>
	);
};

export default TourismGovernorDashboard;
