/** @format */

import { Link } from 'react-router-dom';

const AdvertiserDashBoard = () => {
	return (
		<div className='min-h-screen bg-gray-100'>
			{/* Navigation Bar */}
			<nav className='bg-white shadow-md'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<h1 className='text-2xl font-semibold text-gray-800'>
						Advertiser Dashboard
					</h1>
					<div className='flex space-x-6'>
						<Link
							to='/advertiser-dashboard/profile'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							Profile
						</Link>
						<Link
							to='/advertiser-dashboard/activities'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							Activities
						</Link>
						<Link
							to='/advertiser-dashboard/change-password'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							Change Password
						</Link>
						<Link
							to='/completed'
							className='text-blue-600 hover:text-blue-800 transition duration-300'>
							completed
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-6 py-8'>
				{/* Add content for the dashboard here */}
			</div>
		</div>
	);
};

export default AdvertiserDashBoard;
