/** @format */

import { Link } from 'react-router-dom';

const Dashboard = () => {
	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500'>
			{/* Navbar */}
			<nav className='bg-white shadow-lg'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<h1 className='text-2xl font-bold text-gray-800'>
						Tour Guide Dashboard
					</h1>
					<div className='space-x-6'>
						<Link
							to='/tour-guide-dashboard/profile'
							className='text-blue-600 hover:text-blue-800'>
							Profile
						</Link>
						<Link
							to='/tour-guide-dashboard/itineraries'
							className='text-blue-600 hover:text-blue-800'>
							Itineraries
						</Link>
						<Link
							to='/tour-guide-dashboard/change-password'
							className='text-blue-600 hover:text-blue-800'>
							Change Password
						</Link>
						<Link
							to='/forgot-password'
							className='text-blue-600 hover:text-blue-800'>
							Forgot Password?
						</Link>
						<Link
							to='/itinerary-revenue'
							className='text-blue-600 hover:text-blue-800'>
							Itinerary Revenue
						</Link>
						<Link
							to='/count-tourists-itineraries'
							className='text-blue-600 hover:text-blue-800'>
							Tourists Count
						</Link>
						<Link
							to='/display-notification-itinerary'
							className='text-blue-600 hover:text-blue-800'>
							Notifications
						</Link>
					</div>
				</div>
			</nav>

			{/* Main content */}
			<div className='py-6 px-6'>
				{/* Welcome Section */}
				<div className='bg-white shadow-lg rounded-lg p-6 mb-6'>
					<h2 className='text-3xl font-semibold text-gray-800'>
						Welcome, Tour Guide!
					</h2>
					<p className='text-lg text-gray-600'>
						Manage your itineraries, track revenue, and more from this
						dashboard.
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
								to='/tour-guide-dashboard/profile'
								className='text-blue-600 hover:text-blue-800 transition duration-300'>
								Profile
							</Link>
						</li>
						<li>
							<Link
								to='/tour-guide-dashboard/itineraries'
								className='text-blue-600 hover:text-blue-800 transition duration-300'>
								Itineraries
							</Link>
						</li>
						<li>
							<Link
								to='/tour-guide-dashboard/change-password'
								className='text-blue-600 hover:text-blue-800 transition duration-300'>
								Change Password
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
								to='/itinerary-revenue'
								className='text-blue-600 hover:text-blue-800 transition duration-300'>
								Itinerary Revenue
							</Link>
						</li>
						<li>
							<Link
								to='/count-tourists-itineraries'
								className='text-blue-600 hover:text-blue-800 transition duration-300'>
								Tourists Count
							</Link>
						</li>
						<li>
							<Link
								to='/display-notification-itinerary'
								className='text-blue-600 hover:text-blue-800 transition duration-300'>
								Notifications
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
