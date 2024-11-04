/** @format */

import { Link, useNavigate } from 'react-router-dom';
import ChangePassword from '../Helper/admin-change-password'; // Import the ChangePassword component

const AdminDashboard = () => {
	const navigate = useNavigate();

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Navbar */}
			<nav className='bg-white shadow-lg'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<h1 className='text-2xl font-extrabold text-gray-800'>
						Admin Dashboard
					</h1>
					<div className='space-x-8'>
						<Link
							to='/admins/deleteUser'
							className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
							Manage Users
						</Link>
						<Link
							to='/admins/addAdmin'
							className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
							Add Admin
						</Link>
						<Link
							to='/admins/addGovernor'
							className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
							Add Tour Guide
						</Link>
						{/* Link to Change Password page */}
						<Link
							to='/admins/change-password'
							className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
							Change Password
						</Link>
						<button
							onClick={() => navigate('/products')}
							className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
							Products
						</button>
					</div>
				</div>
			</nav>

			{/* Dashboard Content */}
			<div className='max-w-7xl mx-auto px-6 py-10'>
				<div className='bg-white shadow-md rounded-lg p-6'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Welcome, Admin
					</h2>
					<p className='text-gray-600 mb-6'>
						Manage platform users, add new admins, and more.
					</p>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						<Link
							to='/admins/deleteUser'
							className='block bg-blue-600 text-white text-center py-4 rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105'>
							Manage Users
						</Link>
						<Link
							to='/admins/addAdmin'
							className='block bg-green-600 text-white text-center py-4 rounded-md hover:bg-green-700 transition-all duration-200 transform hover:scale-105'>
							Add New Admin
						</Link>
						<Link
							to='/admins/addGovernor'
							className='block bg-purple-600 text-white text-center py-4 rounded-md hover:bg-purple-700 transition-all duration-200 transform hover:scale-105'>
							Add Tour Guide
						</Link>
						<Link
							to='/admins/category-management'
							className='block bg-yellow-500 text-white text-center py-4 rounded-md hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105'>
							Category Management
						</Link>
						<Link
							to='/admins/preference-tag-management'
							className='block bg-orange-500 text-white text-center py-4 rounded-md hover:bg-orange-600 transition-all duration-200 transform hover:scale-105'>
							Preference Tag Management
						</Link>
					</div>
					{/* Change Password Section */}
					<div className='mt-8'>
						<h2 className='text-2xl font-semibold mb-4'>Change Password</h2>
						<ChangePassword /> {/* Include the ChangePassword component */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
