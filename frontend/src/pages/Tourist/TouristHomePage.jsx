/** @format */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ActivitiesCard from '../../components/Advertiser/ActivitiesCard';
import ItinerariesCard from '../../components/TourGuide/ItinerariesCard';
import AttractionsCard from '../../components/TourismGovernor/AttractionsCard';
import NavigationHeader from '../../components/General/NavigationHeader';
import Footer from '../../components/General/Footer';
import { FaFilter } from 'react-icons/fa';

const TouristGuest = () => {
	const navigate = useNavigate();
	const [showFilters, setShowFilters] = useState(false); // Toggle state for filters
	const toggleFilters = () => setShowFilters(!showFilters);

	// State Management
	const [activities, setActivities] = useState([]);
	const [itineraries, setItineraries] = useState([]);
	const [attractions, setAttractions] = useState([]);

	const [categories, setCategories] = useState([]);
	const [category, setCategory] = useState('');

	const [preferences, setPreferences] = useState([]);
	const [preferenceTag, setPreferenceTag] = useState('');

	const [budget, setBudget] = useState('');
	const [date, setDate] = useState('');
	const [ratings, setRatings] = useState('');

	const [language, setLanguage] = useState('');

	const [activeTab, setActiveTab] = useState('Activities');
	const [rates, setRates] = useState({});
	const [selectedCurrency, setSelectedCurrency] = useState('USD');
	const [conversionRate, setConversionRate] = useState(1);

	const [loadingRates, setLoadingRates] = useState(false);
	const [loadingData, setLoadingData] = useState(false);
	const [errorRates, setErrorRates] = useState('');
	const [errorData, setErrorData] = useState('');

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		// Add more fields as necessary
	});

	// Fetch exchange rates
	useEffect(() => {
		const fetchExchangeRates = async () => {
			setLoadingRates(true);
			try {
				const response = await axios.get(
					'https://v6.exchangerate-api.com/v6/c0f66f5d6657d5223735ba62/latest/USD'
				);
				setRates(response.data.conversion_rates);
				setErrorRates('');
			} catch (error) {
				console.error('Error fetching exchange rates:', error);
				setErrorRates('Failed to load exchange rates.');
			} finally {
				setLoadingRates(false);
			}
		};

		fetchExchangeRates();
	}, []);

	const handleCurrencyChange = (event) => {
		const currency = event.target.value;
		setSelectedCurrency(currency);
		setConversionRate(rates[currency] || 1);
	};

	// Fetch Activities, Itineraries, Attractions, Categories, and Tags
	useEffect(() => {
		fetchAllData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchAllData = async () => {
		setLoadingData(true);
		try {
			await Promise.all([
				fetchActivities(),
				fetchItineraries(),
				fetchAttractions(),
				fetchCategories(),
				fetchTags(),
			]);
			setErrorData('');
		} catch (error) {
			setErrorData('Failed to load data. Please try again later.');
		} finally {
			setLoadingData(false);
		}
	};

	const fetchActivities = async () => {
		try {
			const response = await axios.get('http://localhost:3000/activities');
			setActivities(response.data.activities);
		} catch (error) {
			console.error('Error fetching activities:', error);
			throw error;
		}
	};

	const fetchItineraries = async () => {
		try {
			const response = await axios.get('http://localhost:3000/itineraries');
			setItineraries(response.data);
		} catch (error) {
			console.error('Error fetching itineraries:', error);
			throw error;
		}
	};

	const fetchAttractions = async () => {
		try {
			const response = await axios.get('http://localhost:3000/attractions');
			setAttractions(response.data);
		} catch (error) {
			console.error('Error fetching attractions:', error);
			throw error;
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await axios.get('http://localhost:3000/categories');
			setCategories(response.data);
		} catch (error) {
			console.error('Error fetching categories:', error);
			throw error;
		}
	};

	const fetchTags = async () => {
		try {
			const response = await axios.get('http://localhost:3000/pref-tags');
			setPreferences(response.data);
		} catch (error) {
			console.error('Error fetching tags:', error);
			throw error;
		}
	};

	// Filter Functions
	const filterActivities = async () => {
		setLoadingData(true);
		try {
			const response = await axios.get(
				'http://localhost:3000/activities/filter',
				{
					params: {
						price: budget,
						date,
						category,
						ratings,
						preferenceTag,
					},
				}
			);
			setActivities(response.data.data);
			setErrorData('');
		} catch (error) {
			console.error('Error filtering activities:', error);
			setErrorData('Failed to filter activities.');
		} finally {
			setLoadingData(false);
		}
	};

	const filterItineraries = async () => {
		setLoadingData(true);
		try {
			const response = await axios.get(
				'http://localhost:3000/itineraries/filter',
				{
					params: {
						budget,
						date,
						language,
					},
				}
			);
			setItineraries(response.data);
			setErrorData('');
		} catch (error) {
			console.error('Error filtering itineraries:', error);
			setErrorData('Failed to filter itineraries.');
		} finally {
			setLoadingData(false);
		}
	};

	const filterAttractions = async () => {
		setLoadingData(true);
		try {
			const response = await axios.get(
				'http://localhost:3000/attractions/filter',
				{
					params: {
						preferenceTag,
						category,
					},
				}
			);
			setAttractions(response.data.data);
			setErrorData('');
		} catch (error) {
			console.error('Error filtering attractions:', error);
			setErrorData('Failed to filter attractions.');
		} finally {
			setLoadingData(false);
		}
	};

	// Sort Functions
	const sortItineraries = async (type) => {
		setLoadingData(true);
		try {
			const response = await axios.get(
				'http://localhost:3000/itineraries/sort',
				{
					params: { type },
				}
			);
			setItineraries(response.data.data);
			setErrorData('');
		} catch (error) {
			console.error('Error sorting itineraries:', error);
			setErrorData('Failed to sort itineraries.');
		} finally {
			setLoadingData(false);
		}
	};

	const sortActivities = async (type) => {
		setLoadingData(true);
		try {
			const response = await axios.get(
				'http://localhost:3000/activities/sort',
				{
					params: { type },
				}
			);
			setActivities(response.data.data);
			setErrorData('');
		} catch (error) {
			console.error('Error sorting activities:', error);
			setErrorData('Failed to sort activities.');
		} finally {
			setLoadingData(false);
		}
	};

	// Handle Form Input Changes
	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Render Tab Content Based on Active Tab
	const renderTabContent = () => {
		switch (activeTab) {
			case 'Activities':
				return (
					<div className='text-center'>
						<div className='flex justify-between items-center mb-6 flex-wrap'>
							<h1 className='text-3xl font-extrabold text-white'>Activities</h1>
							<div className='flex flex-wrap justify-center items-center space-x-2 mt-4 sm:mt-0'>
								<label
									htmlFor='currency-select'
									className='mr-2'>
									Currency:
								</label>
								<select
									id='currency-select'
									value={selectedCurrency}
									onChange={handleCurrencyChange}
									className='border border-gray-300 rounded-md p-2'>
									{Object.keys(rates).map((currency) => (
										<option
											key={currency}
											value={currency}>
											{currency}
										</option>
									))}
								</select>

								<button
									onClick={filterActivities}
									className='bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'>
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
						{loadingData ? (
							<div className='flex justify-center items-center'>
								<svg
									className='animate-spin h-8 w-8 text-blue-600'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8v8H4z'></path>
								</svg>
								<span className='ml-2 text-blue-600'>Loading...</span>
							</div>
						) : errorData ? (
							<div
								className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4'
								role='alert'>
								<strong className='font-bold'>Error!</strong>
								<span className='block sm:inline ml-2'>{errorData}</span>
								<button
									className='absolute top-0 bottom-0 right-0 px-4 py-3'
									onClick={() => setErrorData('')}
									aria-label='Close Error Message'>
									&times;
								</button>
							</div>
						) : (
							<div className='flex justify-center'>
								<ActivitiesCard
									activities={activities}
									currency={selectedCurrency}
									conversionRate={conversionRate}
								/>
							</div>
						)}
					</div>
				);
			case 'Itineraries':
				return (
					<div className='text-center'>
						<div className='flex justify-between items-center mb-6 flex-wrap'>
							<h1 className='text-3xl font-extrabold text-white'>
								Itineraries
							</h1>
							<div className='flex flex-wrap justify-center items-center space-x-2 mt-4 sm:mt-0'>
								<label
									htmlFor='currency-select-itineraries'
									className='mr-2'>
									Currency:
								</label>
								<select
									id='currency-select-itineraries'
									value={selectedCurrency}
									onChange={handleCurrencyChange}
									className='border border-gray-300 rounded-md p-2'>
									{Object.keys(rates).map((currency) => (
										<option
											key={currency}
											value={currency}>
											{currency}
										</option>
									))}
								</select>

								<button
									onClick={filterItineraries}
									className='bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'>
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
						{loadingData ? (
							<div className='flex justify-center items-center'>
								<svg
									className='animate-spin h-8 w-8 text-blue-600'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8v8H4z'></path>
								</svg>
								<span className='ml-2 text-blue-600'>Loading...</span>
							</div>
						) : errorData ? (
							<div
								className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4'
								role='alert'>
								<strong className='font-bold'>Error!</strong>
								<span className='block sm:inline ml-2'>{errorData}</span>
								<button
									className='absolute top-0 bottom-0 right-0 px-4 py-3'
									onClick={() => setErrorData('')}
									aria-label='Close Error Message'>
									&times;
								</button>
							</div>
						) : (
							<div className='flex justify-center'>
								<ItinerariesCard
									itineraries={itineraries}
									currency={selectedCurrency}
									conversionRate={conversionRate}
								/>
							</div>
						)}
					</div>
				);
			case 'Attractions':
				return (
					<div className='text-center'>
						<div className='flex justify-between items-center mb-6 flex-wrap'>
							<h1 className='text-3xl font-extrabold text-white'>
								Attractions
							</h1>
							<div className='flex flex-wrap justify-center items-center space-x-2 mt-4 sm:mt-0'>
								<label
									htmlFor='currency-select-attractions'
									className='mr-2'>
									Currency:
								</label>
								<select
									id='currency-select-attractions'
									value={selectedCurrency}
									onChange={handleCurrencyChange}
									className='border border-gray-300 rounded-md p-2'>
									{Object.keys(rates).map((currency) => (
										<option
											key={currency}
											value={currency}>
											{currency}
										</option>
									))}
								</select>

								<button
									onClick={filterAttractions}
									className='bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'>
									Filter
								</button>
							</div>
						</div>
						{loadingData ? (
							<div className='flex justify-center items-center'>
								<svg
									className='animate-spin h-8 w-8 text-blue-600'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8v8H4z'></path>
								</svg>
								<span className='ml-2 text-blue-600'>Loading...</span>
							</div>
						) : errorData ? (
							<div
								className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4'
								role='alert'>
								<strong className='font-bold'>Error!</strong>
								<span className='block sm:inline ml-2'>{errorData}</span>
								<button
									className='absolute top-0 bottom-0 right-0 px-4 py-3'
									onClick={() => setErrorData('')}
									aria-label='Close Error Message'>
									&times;
								</button>
							</div>
						) : (
							<div className='flex justify-center'>
								<AttractionsCard
									attractions={attractions}
									currency={selectedCurrency}
									conversionRate={conversionRate}
								/>
							</div>
						)}
					</div>
				);
			default:
				return <div className='text-center'>No content available.</div>;
		}
	};

	return (
		<div className='bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300  min-h-screen text-gray-800'>
			{/* Header */}
			<header className='flex justify-between items-center p-6 bg-opacity-90 backdrop-blur-lg shadow-md rounded-lg'>
				<div className='flex flex-col'>
					<h1 className='text-2xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500'>
						Journey Jot
					</h1>
					<h2 className='font-extrabold text-white bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500'>
						:::one jot at a time!
					</h2>
				</div>
				<NavigationHeader />
			</header>

			{/* Main Content */}
			<main className='container mx-auto mt-8 px-4'>
				{/* Tabs for Activities, Itineraries, and Attractions */}
				<div className='flex justify-end mb-4'>
					<button
						onClick={toggleFilters}
						className='bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600'>
						<FaFilter />
						<span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
					</button>
				</div>

				<div className='tabs mb-6 flex justify-center space-x-6'>
					<button
						className={`tab-btn ${
							activeTab === 'Activities'
								? 'bg-blue-900 text-white'
								: 'bg-gray-200 text-gray-700'
						} hover:bg-blue-700 hover:text-white py-2 px-6 rounded-lg shadow-md transition duration-300`}
						onClick={() => setActiveTab('Activities')}
						aria-label='Activities Tab'>
						Activities
					</button>
					<button
						className={`tab-btn ${
							activeTab === 'Itineraries'
								? 'bg-blue-900 text-white'
								: 'bg-gray-200 text-gray-700'
						} hover:bg-blue-700 hover:text-white py-2 px-6 rounded-lg shadow-md transition duration-300`}
						onClick={() => setActiveTab('Itineraries')}
						aria-label='Itineraries Tab'>
						Itineraries
					</button>
					<button
						className={`tab-btn ${
							activeTab === 'Attractions'
								? 'bg-blue-900 text-white'
								: 'bg-gray-200 text-gray-700'
						} hover:bg-blue-700 hover:text-white py-2 px-6 rounded-lg shadow-md transition duration-300`}
						onClick={() => setActiveTab('Attractions')}
						aria-label='Attractions Tab'>
						Attractions
					</button>
				</div>

				{/* Filters */}

				{showFilters && (
					<div className='filters mb-6 p-8 bg-white bg-opacity-90 rounded-lg shadow-xl'>
						<h2 className='text-2xl font-semibold mb-6 text-blue-900'>
							Filters
						</h2>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{/* Category Filter */}
							<div className='filter-item'>
								<label
									htmlFor='category'
									className='block text-sm font-medium text-gray-700'>
									Category
								</label>
								<select
									id='category'
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									aria-label='Category Filter'>
									<option value=''>All Categories</option>
									{categories.map((cat) => (
										<option
											key={cat._id}
											value={cat.name}>
											{cat.name}
										</option>
									))}
								</select>
							</div>

							{/* Preferences Filter */}
							<div className='filter-item'>
								<label
									htmlFor='preferenceTag'
									className='block text-sm font-medium text-gray-700'>
									Preferences
								</label>
								<select
									id='preferenceTag'
									value={preferenceTag}
									onChange={(e) => setPreferenceTag(e.target.value)}
									className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									aria-label='Preferences Filter'>
									<option value=''>All Preferences</option>
									{preferences.map((pref) => (
										<option
											key={pref._id}
											value={pref.name}>
											{pref.name}
										</option>
									))}
								</select>
							</div>

							{/* Language Filter */}
							<div className='filter-item'>
								<label
									htmlFor='language'
									className='block text-sm font-medium text-gray-700'>
									Language
								</label>
								<select
									id='language'
									value={language}
									onChange={(e) => setLanguage(e.target.value)}
									className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									aria-label='Language Filter'>
									<option value=''>All Languages</option>
									<option value='English'>English</option>
									<option value='Arabic'>Arabic</option>
									<option value='German'>German</option>
									<option value='Spanish'>Spanish</option>
									<option value='French'>French</option>
								</select>
							</div>

							{/* Budget Filter */}
							<div className='filter-item'>
								<label
									htmlFor='budget'
									className='block text-sm font-medium text-gray-700'>
									Budget
								</label>
								<input
									id='budget'
									type='number'
									value={budget}
									onChange={(e) => setBudget(e.target.value)}
									placeholder='Enter your budget'
									className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									aria-label='Budget Filter'
								/>
							</div>

							{/* Date Filter */}
							<div className='filter-item'>
								<label
									htmlFor='date'
									className='block text-sm font-medium text-gray-700'>
									Date
								</label>
								<input
									id='date'
									type='date'
									value={date}
									onChange={(e) => setDate(e.target.value)}
									className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									aria-label='Date Filter'
								/>
							</div>

							{/* Ratings Filter */}
							<div className='filter-item'>
								<label
									htmlFor='ratings'
									className='block text-sm font-medium text-gray-700'>
									Ratings
								</label>
								<select
									id='ratings'
									value={ratings}
									onChange={(e) => setRatings(e.target.value)}
									className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									aria-label='Ratings Filter'>
									<option value=''>All Ratings</option>
									<option value='1'>1 Star</option>
									<option value='2'>2 Stars</option>
									<option value='3'>3 Stars</option>
									<option value='4'>4 Stars</option>
									<option value='5'>5 Stars</option>
								</select>
							</div>
						</div>
					</div>
				)}

				{/* Render active tab content */}
				{renderTabContent()}
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
};
export default TouristGuest;
