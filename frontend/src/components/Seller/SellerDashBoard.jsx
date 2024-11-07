/** @format */

import { Link } from 'react-router-dom';

const SellerDashBoard = () => {
	return (
		<div className='min-h-screen bg-gray-100'>
			<nav className='bg-white shadow mb-6'>
				<div className='max-w-7xl mx-auto px-4 py-4 flex justify-between'>
					<h1 className='text-xl font-bold'>Seller Dashboard</h1>
					<div>
						<Link
							to='/change-password'
							className='text-blue-600 hover:text-blue-800 mx-4'>
							Change Password
						</Link>
						<Link
							to='/seller-dashboard/profile'
							className='text-blue-600 hover:text-blue-800 mx-4'>
							Profile
						</Link>
						<Link
							to='/products'
							className='text-blue-600 hover:text-blue-800 mx-4'>
							Products
						</Link>
						<Link
							to='/seller-dashboard/change-password'
							className='text-blue-600 hover:text-blue-800'>
							Change Password
						</Link>
						<Link
							to='/products/archive'
							className='text-blue-600 hover:text-blue-800'>
							Products Archive
						</Link>
					</div>
				</div>
			</nav>
			<div className='max-w-7xl mx-auto px-4'></div>
		</div>
	);
};

export default SellerDashBoard;
