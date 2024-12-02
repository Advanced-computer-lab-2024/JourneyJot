/** @format */

import { Link } from 'react-router-dom';

const SellerDashBoard = () => {
	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Navigation Bar */}
			<nav className='bg-white shadow'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<h1 className='text-2xl font-bold text-gray-800'>Seller Dashboard</h1>
					<div className='flex flex-wrap space-x-4'>
						<Link
							to='/seller-dashboard/change-password'
							className='text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300'>
							Change Password
						</Link>
						<Link
							to='/seller-dashboard/profile'
							className='text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300'>
							Profile
						</Link>
						<Link
							to='/products'
							className='text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300'>
							Products
						</Link>
						<Link
							to='/products/archive'
							className='text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300'>
							Products Archive
						</Link>
						<Link
							to='/forgot-password'
							className='text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300'>
							Forgot Password?
						</Link>
						<Link
							to='/notify-seller-product'
							className='text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300'>
							Notify
						</Link>
						<Link
							to='/product-revenue'
							className='text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300'>
							Product Revenue
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className='max-w-7xl mx-auto px-6 py-12'>
				<div className='bg-white rounded-lg shadow-lg p-8'>
					<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
						Welcome to your Dashboard
					</h2>
					<p className='text-gray-600'>
						Here you can manage your profile, view product details, and track
						revenues.
					</p>
					{/* Add more content here */}
				</div>
			</main>
		</div>
	);
};

export default SellerDashBoard;
