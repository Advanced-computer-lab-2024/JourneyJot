/** @format */

import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const AdminDashboard = () => {
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
			path: '/products',
			label: 'View Products',
			color: 'bg-purple-300',
		},
		{
			path: '/products/archive',
			label: 'Archive Products',
			color: 'bg-purple-800',
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
			color: 'bg-gray-500',
		},
		{
			path: '/mail-advertiser',
			label: 'SendEmail To Advertiser',
			color: 'bg-gray-500',
		},
		{ path: '/select-revenue', label: 'Select Revenue', color: 'bg-green-500' },
	];

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Navbar */}
			<nav className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<div className='flex items-center space-x-3'>
						<FaUserCircle className='text-4xl text-gray-700' />
						<h1 className='text-2xl font-extrabold text-gray-800 tracking-tight'>
							Admin Dashboard
						</h1>
					</div>
				</div>
			</nav>

			{/* Dashboard Content */}
			<main className='max-w-7xl mx-auto px-6 py-10'>
				<div className='bg-white rounded-xl shadow-lg p-8'>
					<h2 className='text-3xl font-bold text-gray-900 mb-6'>
						Welcome, Admin
					</h2>
					<p className='text-gray-600 mb-8'>
						Efficiently manage users, categories, and more using the tools
						below.
					</p>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
						{dashboardItems.map(({ path, label, color }, index) => (
							<Link
								key={index}
								to={path}
								className={`flex items-center justify-center text-lg font-medium text-white py-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${color}`}>
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
