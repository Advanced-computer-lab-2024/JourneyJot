/** @format */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ActivitiesCard from '../../components/Advertiser/ActivitiesCard';
import ItinerariesCard from '../../components/TourGuide/ItinerariesCard';
import AttractionsCard from '../../components/TourismGoverner/AttractionsCard';

const TouristHomePage = () => {
	const navigate = useNavigate();
	const [activities, setActivities] = useState([]);
	const [itineraries, setItineraries] = useState([]);
	const [attractions, setAttractions] = useState([]);

	const [budget, setBudget] = useState('');
	const [date, setDate] = useState('');
	const [category, setCategory] = useState('');
	const [ratings, setRatings] = useState('');
	const [preferences, setPreferences] = useState('');
	const [language, setLanguage] = useState('');

	const [activeTab, setActiveTab] = useState('Activities'); // State to track active tab

	// Fetch Activities, Itineraries, and Attractions
	useEffect(() => {
		fetchActivities();
		fetchItineraries();
		fetchAttractions();
	}, []);

	const fetchActivities = async () => {
		try {
			const response = await axios.get('http://localhost:3000/activities');
			setActivities(response.data.activities);
		} catch (error) {
			console.error('Error fetching activities:', error);
		}
	};

	const fetchItineraries = async () => {
		try {
			const response = await axios.get('http://localhost:3000/itineraries');
			setItineraries(response.data);
		} catch (error) {
			console.error('Error fetching itineraries:', error);
		}
	};

	const fetchAttractions = async () => {
		try {
			const response = await axios.get('http://localhost:3000/attractions');
			setAttractions(response.data);
		} catch (error) {
			console.error('Error fetching attractions:', error);
		}
	};

	const filterActivities = async () => {
		try {
			const response = await axios.get(
				'http://localhost:3000/activities/filter',
				{
					params: {
						price: budget,
						date,
						category,
						ratings,
					},
				}
			);
			setActivities(response.data.data);
		} catch (error) {
			console.error('Error filtering activities:', error);
		}
	};

	const sortItineraries = async (type) => {
		try {
			const response = await axios.get(
				'http://localhost:3000/itineraries/sort',
				{
					params: {
						type, // 'price' or 'rating'
					},
				}
			);
			setItineraries(response.data.data);
		} catch (error) {
			console.error('Error sorting itineraries:', error);
		}
	};

	const sortActivities = async (type) => {
		try {
			const response = await axios.get(
				'http://localhost:3000/activities/sort',
				{
					params: {
						type, // 'price' or 'rating'
					},
				}
			);
			setActivities(response.data.data);
		} catch (error) {
			console.error('Error sorting activities:', error);
		}
	};

	const filterItineraries = async () => {
		try {
			const response = await axios.get(
				'http://localhost:3000/itineraries/filter',
				{
					params: {
						budget,
						date,
						language,
						preferences,
					},
				}
			);
			setItineraries(response.data);
		} catch (error) {
			console.error('Error filtering itineraries:', error);
		}
	};

	const filterAttractions = async () => {
		try {
			if (!preferences) {
				console.warn('No preferences provided.');
				return;
			}

			const response = await axios.get(
				'http://localhost:3000/attractions/filter',
				{
					params: {
						preferences,
					},
				}
			);

			setAttractions(response.data.data);
		} catch (error) {
			console.error(
				'Error filtering attractions:',
				error.response ? error.response.data : error.message
			);
		}
	};

	// Render content based on active tab
	const renderTabContent = () => {
		switch (activeTab) {
			case 'Activities':
				return (
					<div className='text-center'>
						<div className='flex justify-between items-center mb-6'>
							<h1 className='text-3xl font-extrabold text-blue-900'>
								Activities
							</h1>
							<div className='flex space-x-2'>
								<button
									onClick={filterActivities}
									className='bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'>
									Filter
								</button>
								<button
									onClick={() => sortActivities('price')}
									className='bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600'>
									Sort by Price
								</button>
								<button
									onClick={() => sortActivities('rating')}
									className='bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600'>
									Sort by Rating
								</button>
							</div>
						</div>
						<div className='flex justify-center'>
							<ActivitiesCard activities={activities} />
						</div>
					</div>
				);
			case 'Itineraries':
				return (
					<div className='text-center'>
						<div className='flex justify-between items-center mb-6'>
							<h1 className='text-3xl font-extrabold text-blue-900'>
								Itineraries
							</h1>
							<div className='flex space-x-2'>
								<button
									onClick={filterItineraries}
									className='bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'>
									Filter
								</button>
								<button
									onClick={() => sortItineraries('price')}
									className='bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600'>
									Sort by Price
								</button>
								<button
									onClick={() => sortItineraries('rating')}
									className='bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600'>
									Sort by Rating
								</button>
							</div>
						</div>
						<div className='flex justify-center'>
							<ItinerariesCard itineraries={itineraries} />
						</div>
					</div>
				);
			case 'Attractions':
				return (
					<div className='text-center'>
						<div className='flex justify-between items-center mb-6'>
							<h1 className='text-3xl font-extrabold text-blue-900'>
								Attractions
							</h1>
							<button
								onClick={filterAttractions}
								className='bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'>
								Filter
							</button>
						</div>
						<div className='flex justify-center'>
							<AttractionsCard attractions={attractions} />
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			<header className='flex justify-between items-center p-4 bg-white shadow-md'>
				<h1 className='text-xl font-bold'>Tourist Home Page</h1>
				<div className='flex space-x-4'>
					<button
						onClick={() => navigate('/tourist/homePage/profile')} // Navigate to Profile page
						className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
						My Profile
					</button>
					<button
						onClick={() => navigate('/tourist/homePage/products')} // Navigate to Products page
						className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
						Products
					</button>
					<button
						onClick={() => navigate('/tourist/homePage/change-password')} // Navigate to Products page
						className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
						changePassword
					</button>
				</div>
			</header>

			{/* Main Content */}
			<div className='container mx-auto py-8 px-4'>
				{/* Filter Section */}
				<div className='bg-white p-6 rounded-lg shadow-lg flex flex-wrap gap-4 items-center justify-center mb-8'>
					<input
						type='number'
						placeholder='Budget'
						value={budget}
						onChange={(e) => setBudget(e.target.value)}
						className='border border-gray-300 p-3 w-60 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600'
					/>
					<input
						type='date'
						placeholder='Date'
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className='border border-gray-300 p-3 w-60 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600'
					/>
					<input
						type='text'
						placeholder='Category'
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className='border border-gray-300 p-3 w-60 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600'
					/>
					<input
						type='number'
						placeholder='Ratings'
						value={ratings}
						onChange={(e) => setRatings(e.target.value)}
						className='border border-gray-300 p-3 w-60 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600'
						min='1'
						max='5'
						step='0.1'
					/>
					<input
						type='text'
						placeholder='Preferences or Tags'
						value={preferences}
						onChange={(e) => setPreferences(e.target.value)}
						className='border border-gray-300 p-3 w-60 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600'
					/>
					<input
						type='text'
						placeholder='Language'
						value={language}
						onChange={(e) => setLanguage(e.target.value)}
						className='border border-gray-300 p-3 w-60 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600'
					/>
				</div>

				{/* Tabs */}
				<div className='mb-6'>
					<div className='flex justify-center border-b border-gray-200'>
						{['Activities', 'Itineraries', 'Attractions'].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`py-2 px-4 -mb-px font-semibold text-lg ${
									activeTab === tab
										? 'border-b-2 border-blue-600 text-blue-600'
										: 'text-gray-500 hover:text-blue-600'
								}`}>
								{tab}
							</button>
						))}
					</div>
				</div>

				{/* Tab Content */}
				{renderTabContent()}
			</div>
		</div>
	);
};

export default TouristHomePage;
