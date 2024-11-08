/** @format */

import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const AdminDashboard = () => {
	const navigate = useNavigate();

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Navbar */}
			<nav className='bg-white shadow-md'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<div className='flex items-center space-x-2'>
						<FaUserCircle className='text-3xl text-gray-600' />
						<span className='text-lg font-semibold text-gray-700'>Profile</span>
					</div>
					<h1 className='text-2xl font-extrabold text-gray-800'>
						Admin Dashboard
					</h1>
					<div className='flex items-center space-x-8'>
						{[
							'/admins/deleteUser',
							'/admins/addAdmin',
							'/admins/addGovernor',
							'/admins/change-password',
							'/admins/admin-account-review',
							'/admins/view-users',
							'/admins/flag-events',
							'/admins/view-complaints', // New Link for Viewing Complaints
						].map((path, index) => (
							<Link
								key={index}
								to={path}
								className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'>
								{path
									.split('/')
									.pop()
									.replace('-', ' ')
									.replace(/\b\w/g, (char) => char.toUpperCase())}
							</Link>
						))}
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
				<div className='bg-white shadow-lg rounded-lg p-8'>
					<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
						Welcome, Admin
					</h2>
					<p className='text-gray-600 mb-6'>
						Manage platform users, add new admins, and more.
					</p>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[
							{
								path: '/admins/deleteUser',
								label: 'Manage Users',
								color: 'bg-blue-600',
							},
							{
								path: '/admins/addAdmin',
								label: 'Add New Admin',
								color: 'bg-green-600',
							},
							{
								path: '/admins/addGovernor',
								label: 'Add Tour Guide',
								color: 'bg-purple-600',
							},
							{
								path: '/admins/category-management',
								label: 'Category Management',
								color: 'bg-yellow-500',
							},
							{
								path: '/admins/preference-tag-management',
								label: 'Preference Tag Management',
								color: 'bg-orange-500',
							},
							{
								path: '/admins/change-password',
								label: 'Change Password',
								color: 'bg-red-500',
							},
							{
								path: '/admins/admin-account-review',
								label: 'Admin Account Review',
								color: 'bg-teal-500',
							},
							{
								path: '/admins/view-users',
								label: 'Users List',
								color: 'bg-indigo-400',
							},
							{
								path: '/admins/flag-events',
								label: 'Flag Event',
								color: 'bg-indigo-400',
							},
							{
								path: '/admins/view-complaints', // New Button for Viewing Complaints
								label: 'View Complaints',
								color: 'bg-purple-500',
							},
						].map(({ path, label, color }, index) => (
							<Link
								key={index}
								to={path}
								className={`${color} text-white text-center py-4 rounded-lg hover:${color.replace(
									'500',
									'600'
								)} transition-all duration-300 transform hover:scale-105 shadow-lg`}>
								{label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
