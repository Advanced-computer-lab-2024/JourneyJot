/** @format */

import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const AdminDashboard = () => {
	const navigate = useNavigate();

	const navLinks = [
		'/admins/deleteUser',
		'/admins/addAdmin',
		'/admins/addGovernor',
		'/admins/change-password',
		'/admins/admin-account-review',
		'/admins/view-users',
		'/admins/flag-events',
		'/products/archive',
		'/admins/complaints', // New route added here
	];

	const dashboardItems = [
		{
			path: '/admins/deleteUser',
			label: 'Manage Users',
			color: 'bg-indigo-500',
		},
		{ path: '/admins/addAdmin', label: 'Add New Admin', color: 'bg-teal-500' },
		{
			path: '/admins/addGovernor',
			label: 'Add Tour Guide',
			color: 'bg-purple-500',
		},
		{
			path: '/admins/category-management',
			label: 'Category Management',
			color: 'bg-amber-400',
		},
		{
			path: '/admins/preference-tag-management',
			label: 'Preference Tag Management',
			color: 'bg-orange-400',
		},
		{
			path: '/admins/change-password',
			label: 'Change Password',
			color: 'bg-rose-400',
		},
		{
			path: '/admins/admin-account-review',
			label: 'Admin Account Review',
			color: 'bg-cyan-500',
		},
		{ path: '/admins/view-users', label: 'Users List', color: 'bg-blue-400' },
		{
			path: '/admins/flag-events',
			label: 'Flag Event',
			color: 'bg-violet-500',
		},
		{
			path: '/admins/complaints',
			label: 'Manage Complaints',
			color: 'bg-red-500',
		},
		{
			path: '/forgot-password',
			label: 'Forget Password',
			color: 'bg-red-500',
		},
	];

	const formatLinkText = (path) =>
		path
			.split('/')
			.pop()
			.replace('-', ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());

	return (
		<div className='min-h-screen bg-gray-100'>
			{/* Navbar */}
			<nav className='bg-white shadow-md border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<div className='flex items-center space-x-2'>
						<FaUserCircle className='text-3xl text-gray-700' />
						<h4 className='text-2xl font-bold text-gray-800'>
							Admin Dashboard
						</h4>
					</div>

					<div className='flex items-center space-x-6'>
						{navLinks.map((path, index) => (
							<Link
								key={index}
								to={path}
								className='text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium'>
								{formatLinkText(path)}
							</Link>
						))}
						<button
							onClick={() => navigate('/products')}
							className='text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium'>
							Products
						</button>
					</div>
				</div>
			</nav>

			{/* Dashboard Content */}
			<main className='max-w-7xl mx-auto px-6 py-10'>
				<div className='bg-white shadow-lg rounded-lg p-8'>
					<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
						Welcome, Admin
					</h2>
					<p className='text-gray-600 mb-6'>
						Manage platform users, add new admins, and more.
					</p>
					{/* Grid for dashboard items */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{dashboardItems.map(({ path, label, color }, index) => (
							<Link
								key={index}
								to={path}
								className={`${color} text-white text-center py-6 rounded-lg shadow-lg hover:${color.replace(
									'500',
									'600'
								)} transform hover:scale-105 transition-all duration-300`}>
								{label}
							</Link>
						))}
					</div>
				</div>
			</main>
		</div>
	);
};

export default AdminDashboard;
