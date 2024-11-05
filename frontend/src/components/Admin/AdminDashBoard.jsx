/** @format */

import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const AdminDashboard = () => {
	const navigate = useNavigate();

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Navbar */}
			<nav className='bg-white shadow-lg'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<div className='flex items-center space-x-2'>
						<FaUserCircle className='text-3xl text-gray-600' /> {/* Profile icon */}
						<span className='text-lg font-medium text-gray-700'>Profile</span>
					</div>
					<div className='flex items-center space-x-4'>
						<h1 className='text-2xl font-extrabold text-gray-800'>Admin Dashboard</h1>

					</div>
					<div className='space-x-8'>
						<Link
							to='/change-password'
							className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
							Change Password
						</Link>
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
						{/* Link to Admin Account Review page */}
						<Link
							to='/admins/admin-account-review'
							className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
							Admin Account Review
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
						<Link
							to='/admins/change-password'
							className='block bg-red-500 text-white text-center py-4 rounded-md hover:bg-orange-600 transition-all duration-200 transform hover:scale-105'>
							Change Password
						</Link>
						{/* Link to Admin Account Review page in the grid */}
						<Link
							to='/admins/admin-account-review'
							className='block bg-teal-500 text-white text-center py-4 rounded-md hover:bg-teal-600 transition-all duration-200 transform hover:scale-105'>
							Admin Account Review
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
