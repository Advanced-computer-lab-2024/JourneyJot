/** @format */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	FaUserCircle,
	FaUsers,
	FaPlus,
	FaBell,
	FaTags,
	FaLock,
	FaChartLine,
	FaClipboardList,
	FaFlag,
	FaEnvelope,
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const dashboardItems = [
	{
		path: '/admins/deleteUser',
		label: 'Manage Users',
		color: 'bg-indigo-500',
		icon: <FaUsers className='text-2xl' />,
	},
	{
		path: '/admins/addAdmin',
		label: 'Add New Admin',
		color: 'bg-teal-500',
		icon: <FaPlus className='text-2xl' />,
	},
	{
		path: '/notify-admin-product',
		label: 'Notify',
		color: 'bg-teal-500',
		icon: <FaBell className='text-2xl' />,
	},
	{
		path: '/create-promocode',
		label: 'PromoCodes',
		color: 'bg-teal-500',
		icon: <FaTags className='text-2xl' />,
	},
	{
		path: '/admins/addGovernor',
		label: 'Add Tour Guide',
		color: 'bg-purple-500',
		icon: <FaUserCircle className='text-2xl' />,
	},
	{
		path: '/products',
		label: 'View Products',
		color: 'bg-purple-300',
		icon: <FaChartLine className='text-2xl' />,
	},
	{
		path: '/products/archive',
		label: 'Archive Products',
		color: 'bg-purple-800',
		icon: <FaClipboardList className='text-2xl' />,
	},
	{
		path: '/admins/category-management',
		label: 'Category Management',
		color: 'bg-amber-400',
		icon: <FaTags className='text-2xl' />,
	},
	{
		path: '/admins/preference-tag-management',
		label: 'Preference Tag Management',
		color: 'bg-orange-400',
		icon: <FaTags className='text-2xl' />,
	},
	{
		path: '/admins/change-password',
		label: 'Change Password',
		color: 'bg-rose-400',
		icon: <FaLock className='text-2xl' />,
	},
	{
		path: '/admins/admin-account-review',
		label: 'Admin Account Review',
		color: 'bg-cyan-500',
		icon: <FaUsers className='text-2xl' />,
	},
	{
		path: '/admins/view-users',
		label: 'Users List',
		color: 'bg-blue-400',
		icon: <FaUsers className='text-2xl' />,
	},
	{
		path: '/admins/flag-events',
		label: 'Flag Event',
		color: 'bg-violet-500',
		icon: <FaFlag className='text-2xl' />,
	},
	{
		path: '/admins/complaints',
		label: 'Manage Complaints',
		color: 'bg-red-500',
		icon: <FaEnvelope className='text-2xl' />,
	},
	{
		path: '/forgot-password',
		label: 'Forget Password',
		color: 'bg-gray-500',
		icon: <FaLock className='text-2xl' />,
	},
	{
		path: '/mail-advertiser',
		label: 'Send Email To Advertiser',
		color: 'bg-gray-500',
		icon: <FaEnvelope className='text-2xl' />,
	},
	{
		path: '/mail-tour-guide',
		label: 'Send Email To TourGuide',
		color: 'bg-gray-500',
		icon: <FaEnvelope className='text-2xl' />,
	},
	{
		path: '/select-revenue',
		label: 'Select Revenue',
		color: 'bg-green-500',
		icon: <FaChartLine className='text-2xl' />,
	},
];

// Reusable Dashboard Item Component
const DashboardItem = ({ path, label, color, icon }) => (
	<Link
		to={path}
		className={`flex flex-col items-center justify-center text-lg font-semibold text-white py-6 px-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 ${color}`}>
		<div className='mb-4'>{icon}</div>
		<span>{label}</span>
	</Link>
);

const AdminDashboard = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400'>
			{/* Navbar */}
			<nav className='bg-gray-900 shadow'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16'>
						<div className='flex'>
							<div className='flex-shrink-0 flex items-center'>
								<FaUserCircle className='text-3xl text-white' />
								<span className='ml-2 text-2xl font-semibold text-white'>
									Admin Dashboard
								</span>
							</div>
						</div>
						<div className='flex items-center'>
							<div className='ml-3 relative'>
								<div>
									<button
										onClick={() => setDropdownOpen(!dropdownOpen)}
										className='flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
										id='user-menu'
										aria-haspopup='true'>
										<FaUserCircle className='h-8 w-8 text-gray-300' />
									</button>
								</div>
								{dropdownOpen && (
									<div
										className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'
										role='menu'
										aria-orientation='vertical'
										aria-labelledby='user-menu'>
										<div
											className='py-1'
											role='none'>
											<Link
												to='/'
												className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
												role='menuitem'>
												<FiLogOut className='inline mr-2' /> Logout
											</Link>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</nav>

			{/* Dashboard Content */}
			<main className='py-10'>
				<div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
					<div className='bg-white shadow overflow-hidden sm:rounded-lg'>
						<div className='px-4 py-5 sm:px-6'>
							<h2 className='text-3xl leading-6 font-semibold text-gray-900'>
								Welcome, Admin
							</h2>
							<p className='mt-1 max-w-2xl text-sm text-gray-500'>
								Manage users, categories, and other admin tools below.
							</p>
						</div>
						<div className='border-t border-gray-200'>
							<div className='px-4 py-5 sm:p-6'>
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
									{dashboardItems.map(({ path, label, color, icon }, index) => (
										<DashboardItem
											key={index}
											path={path}
											label={label}
											color={color || 'bg-gray-200'} // Default to gray if no color is specified
											icon={icon}
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default AdminDashboard;
