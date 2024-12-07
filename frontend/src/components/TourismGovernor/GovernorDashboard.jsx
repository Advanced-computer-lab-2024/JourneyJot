/** @format */
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const GovernorDashBoard = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300'>
			<nav className='bg-white shadow-lg'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<h1 className='text-2xl font-bold text-gray-800'>
						Governor Dashboard
					</h1>
					<div className='space-x-6'>
						<Link
							to='/tourism-governor'
							className='text-blue-600 hover:text-blue-800'>
							Attractions
						</Link>
						<Link
							to='/forgot-password'
							className='text-blue-600 hover:text-blue-800'>
							Forgot Password?
						</Link>
						<Link
							to='/attraction-revenue'
							className='text-blue-600 hover:text-blue-800'>
							Attraction Revenue
						</Link>
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
			</nav>

			{/* Main content */}
			<div className='py-6 px-6'>
				{/* Welcome Section */}
				<div className='bg-white shadow-lg rounded-lg p-6 mb-6'>
					<h2 className='text-3xl font-semibold text-gray-800'>
						Welcome, Governor!
					</h2>
					<p className='text-lg text-gray-600'>
						Manage attractions, track revenue, and more from this dashboard.
					</p>
				</div>

				{/* Navigation Links Section */}
				<div className='bg-white shadow-md rounded-lg p-6 mt-6'>
					<h3 className='text-2xl font-semibold text-gray-800 mb-4'>
						Quick Links
					</h3>
					<ul className='space-y-4'>
						<li>
							<Link
								to='/tourism-governor'
								className='text-blue-600 hover:text-blue-800 transition duration-300'>
								Attractions
							</Link>
						</li>
						<li>
							<Link
								to='/forgot-password'
								className='text-blue-600 hover:text-blue-800 transition duration-300'>
								Forgot Password?
							</Link>
						</li>
						<li>
							<Link
								to='/attraction-revenue'
								className='text-blue-600 hover:text-blue-800 transition duration-300'>
								Attraction Revenue
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default GovernorDashBoard;
