/** @format */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ActivitiesCard from '../../components/Advertiser/ActivitiesCard';
import ItinerariesCard from '../../components/TourGuide/ItinerariesCard';
import AttractionsCard from '../../components/TourismGovernor/AttractionsCard';
import Header from './Header';
import CurrencySelect from './CurrencySelect';

const TouristGuest = () => {
	const navigate = useNavigate();

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

	useEffect(() => {
		// Fetch exchange rates
		axios
			.get(
				'https://v6.exchangerate-api.com/v6/96d68d4689bfcab5166205e1/latest/USD'
			)
			.then((response) => {
				setRates(response.data.conversion_rates);
			})
			.catch((error) => {
				console.error('Error fetching exchange rates:', error);
			});
	}, []);

	const handleCurrencyChange = (event) => {
		const currency = event.target.value;
		setSelectedCurrency(currency);
		setConversionRate(rates[currency] || 1);
	};

	// Fetch Activities, Itineraries, Attractions, Categories, and Tags
	useEffect(() => {
		fetchActivities();
		fetchItineraries();
		fetchAttractions();
		fetchCategories();
		fetchTags();
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

	const fetchCategories = async () => {
		try {
			const response = await axios.get('http://localhost:3000/categories');
			setCategories(response.data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const fetchTags = async () => {
		try {
			const response = await axios.get('http://localhost:3000/pref-tags');
			setPreferences(response.data);
		} catch (error) {
			console.error('Error fetching tags:', error);
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
						preferenceTag,
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
					params: { type },
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
					params: { type },
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
		} catch (error) {
			console.error('Error filtering attractions:', error);
		}
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case 'Activities':
				return (
					<div className='text-center'>
						<div></div>
						<div className='flex justify-between items-center mb-6'>
							<h1 className='text-3xl font-extrabold text-blue-900'>
								Activities
							</h1>
							<div className='flex space-x-2'>
								<CurrencySelect
									selectedCurrency={selectedCurrency}
									rates={rates}
									handleCurrencyChange={handleCurrencyChange}
								/>

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
							<ActivitiesCard
								activities={activities}
								currency={selectedCurrency}
								conversionRate={conversionRate}
							/>
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
								<CurrencySelect
									selectedCurrency={selectedCurrency}
									rates={rates}
									handleCurrencyChange={handleCurrencyChange}
								/>

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
							<ItinerariesCard
								itineraries={itineraries}
								currency={selectedCurrency}
								conversionRate={conversionRate}
							/>
						</div>
					</div>
				);
			case 'Attractions':
				return (
					<div className='text-center'>
						<CurrencySelect
							selectedCurrency={selectedCurrency}
							rates={rates}
							handleCurrencyChange={handleCurrencyChange}
						/>

						<div></div>

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
							<AttractionsCard
								attractions={attractions}
								currency={selectedCurrency}
								conversionRate={conversionRate}
							/>
						</div>
					</div>
				);
			default:
				return <div>No content available.</div>;
		}
	};

	return (
		<div className='bg-gray-100 min-h-screen'>
			<Header />
			<div className='container mx-auto mt-8'>
				{/* Tabs for Activities, Itineraries, and Attractions */}
				<div className='tabs mb-6 flex justify-center space-x-6'>
					<button
						className={`tab-btn ${
							activeTab === 'Activities'
								? 'bg-blue-500 text-white'
								: 'text-blue-500'
						} hover:bg-blue-500 hover:text-white py-2 px-4 rounded-md transition`}
						onClick={() => setActiveTab('Activities')}>
						Activities
					</button>
					<button
						className={`tab-btn ${
							activeTab === 'Itineraries'
								? 'bg-blue-500 text-white'
								: 'text-blue-500'
						} hover:bg-blue-500 hover:text-white py-2 px-4 rounded-md transition`}
						onClick={() => setActiveTab('Itineraries')}>
						Itineraries
					</button>
					<button
						className={`tab-btn ${
							activeTab === 'Attractions'
								? 'bg-blue-500 text-white'
								: 'text-blue-500'
						} hover:bg-blue-500 hover:text-white py-2 px-4 rounded-md transition`}
						onClick={() => setActiveTab('Attractions')}>
						Attractions
					</button>
				</div>

				{/* Filters */}
				<div className='filters mb-6 p-6 bg-white rounded-lg shadow-lg'>
					<h2 className='text-xl font-bold mb-4'>Filters</h2>
					<div className='grid grid-cols-2 gap-4'>
						<div className='filter-item'>
							<label
								htmlFor='category'
								className='block text-sm font-medium'>
								Category
							</label>
							<select
								id='category'
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className='form-select w-full mt-1'>
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

						<div className='filter-item'>
							<label
								htmlFor='preferenceTag'
								className='block text-sm font-medium'>
								Tags (Preferences)
							</label>
							<select
								id='preferenceTag'
								value={preferenceTag}
								onChange={(e) => setPreferenceTag(e.target.value)}
								className='form-select w-full mt-1'>
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

						<div className='filter-item'>
							<label
								htmlFor='budget'
								className='block text-sm font-medium'>
								Budget
							</label>
							<input
								id='budget'
								type='number'
								value={budget}
								onChange={(e) => setBudget(e.target.value)}
								placeholder='Enter your budget'
								className='form-input w-full mt-1'
							/>
						</div>

						<div className='filter-item'>
							<label
								htmlFor='date'
								className='block text-sm font-medium'>
								Date
							</label>
							<input
								id='date'
								type='date'
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className='form-input w-full mt-1'
							/>
						</div>

						<div className='filter-item'>
							<label
								htmlFor='ratings'
								className='block text-sm font-medium'>
								Ratings
							</label>
							<select
								id='ratings'
								value={ratings}
								onChange={(e) => setRatings(e.target.value)}
								className='form-select w-full mt-1'>
								<option value=''>All Ratings</option>
								<option value='1'>1 Star</option>
								<option value='2'>2 Stars</option>
								<option value='3'>3 Stars</option>
								<option value='4'>4 Stars</option>
								<option value='5'>5 Stars</option>
							</select>
						</div>

						<div className='filter-item'>
							<label
								htmlFor='language'
								className='block text-sm font-medium'>
								Language
							</label>
							<select
								id='language'
								value={language}
								onChange={(e) => setLanguage(e.target.value)}
								className='form-select w-full mt-1'>
								<option value=''>All Languages</option>
								<option value='English'>English</option>
								<option value='Arabic'>Arabic</option>
								<option value='German'>German</option>
								<option value='Spanish'>Spanish</option>
								<option value='France'>France</option>
								<option value='Chinese'>Chinese</option>
								<option value='Greek'>Greek</option>
							</select>
						</div>
					</div>
				</div>

				{/* Render active tab content */}
				{renderTabContent()}
			</div>
		</div>
	);
};

export default TouristGuest;
