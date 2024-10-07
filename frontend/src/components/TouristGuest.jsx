/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';
import ActivitiesCard from './ActivitiesCard';
import ItinerariesCard from './ItinerariesCard';
import AttractionsCard from './AttractionsCard';
import Header from './Header';
const TouristGuest = () => {
	const [activities, setActivities] = useState([]);
	const [itineraries, setItineraries] = useState([]);
	const [attractions, setAttractions] = useState([]);

	const [budget, setBudget] = useState('');
	const [date, setDate] = useState('');
	const [category, setCategory] = useState('');
	const [ratings, setRatings] = useState('');
	const [preferences, setPreferences] = useState('');
	const [language, setLanguage] = useState('');

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
			console.log(response.data);
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

	const sortItineraries = async () => {
		try {
			const response = await axios.get(
				'http://localhost:3000/itineraries/sort',
				{
					params: {
						budget,
						ratings,
					},
				}
			);
			setItineraries(response.data);
		} catch (error) {
			console.error('Error sorting itineraries:', error);
		}
	};

	const sortActivities = async () => {
		try {
			const response = await axios.get(
				'http://localhost:3000/activities/sort',
				{
					params: {
						budget,
						ratings,
					},
				}
			);
			setActivities(response.data);
		} catch (error) {
			console.error('Error filtering activities:', error);
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
			console.error('Error filtering activities:', error);
		}
	};

	const filterAttractions = async () => {
		try {
			// Check if preferences is defined and not empty
			if (!preferences) {
				console.warn('No preferences provided.');
				return; // Exit if no preferences
			}

			const response = await axios.get(
				'http://localhost:3000/attractions/filter',
				{
					params: {
						preferences,
					},
				}
			);

			// Assuming response.data is an object with { count, data }
			setAttractions(response.data.data); // Update state with attractions
		} catch (error) {
			console.error(
				'Error filtering attractions:',
				error.response ? error.response.data : error.message
			);
		}
	};

	return (
		<div className='container mx-auto py-8 px-4 flex flex-col space-y-12'>
			{/* Header Section with Sign Up and Log In buttons */}
			<Header />

			{/* Filter Section */}
			<div className='bg-white p-6 rounded-lg shadow-lg flex flex-wrap gap-4 items-center justify-center'>
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

			{/* Activities Section */}
			<div className='text-center'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-3xl font-extrabold text-blue-900'>Activities</h1>
					<div className='flex space-x-2'>
						<button
							onClick={filterActivities}
							className='bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'>
							Filter
						</button>
						<button
							onClick={sortActivities}
							className='bg-gray-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600'>
							Sort
						</button>
					</div>
				</div>
				<div className='flex justify-center'>
					<ActivitiesCard activities={activities} />
				</div>
			</div>

			{/* Itineraries Section */}
			<div className='text-center'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-3xl font-extrabold text-blue-900'>Itineraries</h1>
					<div className='flex space-x-2'>
						<button
							onClick={filterItineraries}
							className='bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'>
							Filter
						</button>
						<button
							onClick={sortItineraries}
							className='bg-gray-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600'>
							Sort
						</button>
					</div>
				</div>
				<div className='flex justify-center'>
					<ItinerariesCard itineraries={itineraries} />
				</div>
			</div>

			{/* Attractions Section */}
			<div className='text-center'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-3xl font-extrabold text-blue-900'>Attractions</h1>
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
		</div>
	);
};

export default TouristGuest;
