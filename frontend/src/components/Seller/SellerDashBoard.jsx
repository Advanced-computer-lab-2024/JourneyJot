/** @format */

import { Link } from 'react-router-dom';

const SellerDashBoard = () => {
	return (
		<div className='min-h-screen bg-gray-100'>
			{/* Navigation Bar */}
			<nav className='bg-white shadow-md'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<h1 className='text-2xl font-semibold text-gray-800'>
						Seller Dashboard
					</h1>
					<div className='flex space-x-6'>
						<Link
							to='/seller-dashboard/change-password'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							Change Password
						</Link>
						<Link
							to='/seller-dashboard/profile'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							Profile
						</Link>
						<Link
							to='/products'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							Products
						</Link>
						<Link
							to='/products/archive'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							Products Archive
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-6 py-8'>
				{/* You can add more content here */}
			</div>
		</div>
	);
};

export default SellerDashBoard;
