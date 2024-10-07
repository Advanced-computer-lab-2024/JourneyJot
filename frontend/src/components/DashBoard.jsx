/** @format */

import { Link, Route, Routes } from 'react-router-dom';
import TourGuideProfile from './TourGuideProfile'; // Adjust the path if necessary
import Itineraries from './Itineraries'; // Placeholder for the itineraries component

const Dashboard = () => {
	return (
		<div className='min-h-screen bg-gray-100'>
			<nav className='bg-white shadow mb-6'>
				<div className='max-w-7xl mx-auto px-4 py-4 flex justify-between'>
					<h1 className='text-xl font-bold'>Tour Guide Dashboard</h1>
					<div>
						<Link
							to='/dashboard/profile'
							className='text-blue-600 hover:text-blue-800 mx-4'>
							Profile
						</Link>
						<Link
							to='/dashboard/itineraries'
							className='text-blue-600 hover:text-blue-800'>
							Itineraries
						</Link>
					</div>
				</div>
			</nav>
			<div className='max-w-7xl mx-auto px-4'>
				<Routes>
					<Route
						path='profile'
						element={<TourGuideProfile />}
					/>
					<Route
						path='itineraries'
						element={<Itineraries />}
					/>
				</Routes>
			</div>
		</div>
	);
};

export default Dashboard;
