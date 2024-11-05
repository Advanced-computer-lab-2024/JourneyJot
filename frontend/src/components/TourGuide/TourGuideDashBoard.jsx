/** @format */

import { Link } from 'react-router-dom';

const Dashboard = () => {
	return (
		<div className='min-h-screen bg-gray-100'>
			<nav className='bg-white shadow mb-6'>
				<div className='max-w-7xl mx-auto px-4 py-4 flex justify-between'>
					<h1 className='text-xl font-bold'>Tour Guide Dashboard</h1>
					<div>
						<Link
							to='/change-password'
							className='text-blue-600 hover:text-blue-800 mx-4'>
							Change Password
						</Link>
						<Link
							to='/tour-guide-dashboard/profile'
							className='text-blue-600 hover:text-blue-800 mx-4'>
							Profile
						</Link>
						<Link
							to='/tour-guide-dashboard/itineraries'
							className='text-blue-600 hover:text-blue-800 mx-4'>
							Itineraries
						</Link>
						<Link
							to='/tour-guide-dashboard/change-password'
							className='text-blue-600 hover:text-blue-800'>
							Change Password
						</Link>
					</div>
				</div>
			</nav>
			<div className='max-w-7xl mx-auto px-4'></div>
		</div>
	);
};

export default Dashboard;
