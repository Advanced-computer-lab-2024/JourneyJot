/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItinerariesComponent = () => {
	const [itineraries, setItineraries] = useState([]);
	const [newItinerary, setNewItinerary] = useState({
		name: '',
		activities: [],
		locations: [],
		timeline: '',
		duration: '',
		language: '',
		price: '',
		rating: '',
		availableDates: [],
		accessibility: '',
		pickupLocation: '',
		dropoffLocation: '',
		bookingOpen: '',
	});

	const [isEditing, setIsEditing] = useState(false);
	const [editItineraryId, setEditItineraryId] = useState(null);
	const [availableDatesError, setAvailableDatesError] = useState('');
	const navigate = useNavigate();

	// Fetch all itineraries on component mount
	useEffect(() => {
		const fetchItineraries = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					throw new Error('No token found. Please login again.');
				}

				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};

				const response = await axios.get(
					'http://localhost:3000/itineraries/all',
					config
				);
				setItineraries(response.data);
			} catch (error) {
				console.error('Failed to fetch itineraries', error);
			}
		};
		fetchItineraries();
	}, []);

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (type === 'checkbox') {
			setNewItinerary({
				...newItinerary,
				[name]: checked,
			});
		} else if (name === 'activities' || name === 'locations') {
			setNewItinerary({
				...newItinerary,
				[name]: value ? value.split(',').map((item) => item.trim()) : [],
			});
		} else if (name === 'availableDates') {
			const dates = value ? value.split(',').map((item) => item.trim()) : [];
			const validDates = dates.filter((date) => {
				const parsedDate = new Date(date);
				return parsedDate instanceof Date && !isNaN(parsedDate);
			});

			if (validDates.length < dates.length) {
				setAvailableDatesError(
					'Some dates are invalid. Only valid dates will be saved.'
				);
			} else {
				setAvailableDatesError('');
			}

			setNewItinerary({
				...newItinerary,
				availableDates: validDates,
			});
		} else {
			setNewItinerary({ ...newItinerary, [name]: value || '' });
		}
	};

	// Create or Update Itinerary
	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');

		if (!token) {
			console.error('No token found. Please login again.');
			return;
		}

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		// Check for errors before submitting
		if (availableDatesError) {
			console.error('Cannot submit due to invalid dates:', availableDatesError);
			return; // Prevent submission if there's an error
		}

		try {
			if (isEditing) {
				// Update itinerary
				await axios.put(
					`http://localhost:3000/itineraries/${editItineraryId}`,
					newItinerary,
					config
				);
				setIsEditing(false);
				setEditItineraryId(null);
			} else {
				// Create a new itinerary
				await axios.post(
					'http://localhost:3000/itineraries/',
					newItinerary,
					config
				);
			}

			// Refresh the itineraries list
			const response = await axios.get(
				'http://localhost:3000/itineraries/',
				config
			);
			setItineraries(response.data);
			setNewItinerary({
				name: '',
				activities: [],
				locations: [],
				timeline: '',
				duration: '',
				language: '',
				price: '',
				rating: '',
				availableDates: [],
				accessibility: '',
				pickupLocation: '',
				dropoffLocation: '',
				bookingOpen: '',
			}); // Reset form
		} catch (error) {
			console.error('Failed to save itinerary', error);
		}
	};

	// Edit an itinerary
	const handleEdit = (itinerary) => {
		setNewItinerary(itinerary);
		setIsEditing(true);
		setEditItineraryId(itinerary._id);
	};

	// Delete an itinerary
	const handleDelete = async (id) => {
		const token = localStorage.getItem('token');

		if (!token) {
			console.error('No token found. Please login again.');
			return;
		}

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		try {
			await axios.delete(`http://localhost:3000/itineraries/${id}`, config);
			setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
		} catch (error) {
			console.error('Failed to delete itinerary', error);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-300 flex items-center justify-center p-8'>
			<div className='bg-white rounded-lg shadow-lg w-full max-w-4xl p-6'>
				<button
					onClick={() => navigate(-1)}
					className='text-gray-700 text-xl mb-4 flex items-center hover:text-gray-900 transition'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6 mr-2'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15 19l-7-7 7-7'
						/>
					</svg>
					Back
				</button>
				<h2 className='text-2xl font-bold text-gray-800 mb-6'>
					Manage Itineraries
				</h2>

				{/* Itinerary Form */}
				<form
					onSubmit={handleSubmit}
					className='space-y-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<input
							type='text'
							name='name'
							value={newItinerary.name}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Itinerary Name'
							required
						/>

						<input
							type='text'
							name='timeline'
							value={newItinerary.timeline}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Timeline'
							required
						/>

						<input
							type='text'
							name='activities'
							value={newItinerary.activities.join(', ')}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Activities (comma separated)'
						/>

						<input
							type='text'
							name='locations'
							value={newItinerary.locations.join(', ')}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Locations (comma separated)'
						/>

						<input
							type='text'
							name='duration'
							value={newItinerary.duration}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Duration'
						/>

						<input
							type='text'
							name='language'
							value={newItinerary.language}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Language'
						/>

						<input
							type='text'
							name='price'
							value={newItinerary.price}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Price'
						/>

						<input
							type='number'
							name='rating'
							value={newItinerary.rating}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Rating (0-5)'
							min='0'
							max='5'
						/>
					</div>

					<input
						type='text'
						name='availableDates'
						value={newItinerary.availableDates.join(', ')}
						onChange={handleInputChange}
						className='p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
						placeholder='Available Dates (comma separated)'
					/>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<input
							type='text'
							name='accessibility'
							value={newItinerary.accessibility}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Accessibility'
						/>

						<input
							type='text'
							name='pickupLocation'
							value={newItinerary.pickupLocation}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Pickup Location'
						/>

						<input
							type='text'
							name='dropoffLocation'
							value={newItinerary.dropoffLocation}
							onChange={handleInputChange}
							className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Dropoff Location'
						/>
					</div>

					<label className='flex items-center space-x-2'>
						<input
							type='checkbox'
							name='bookingOpen'
							checked={newItinerary.bookingOpen}
							onChange={handleInputChange}
							className='form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-500'
						/>
						<span className='text-gray-600'>Booking Open</span>
					</label>

					{availableDatesError && (
						<p className='text-red-500'>{availableDatesError}</p>
					)}

					<button
						type='submit'
						className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition'>
						{isEditing ? 'Update Itinerary' : 'Add Itinerary'}
					</button>
				</form>

				{/* Itineraries List */}
				<ul className='mt-8 space-y-4'>
					{itineraries.map((itinerary) => (
						<li
							key={itinerary._id}
							className='border rounded-lg p-4 shadow-md hover:shadow-lg transition'>
							<div className='flex justify-between items-center'>
								<h4 className='text-lg font-semibold text-gray-800'>
									{itinerary.timeline}
								</h4>
								<div className='space-x-2'>
									<button
										onClick={() => handleEdit(itinerary)}
										className='bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition'>
										Edit
									</button>
									<button
										onClick={() => handleDelete(itinerary._id)}
										className='bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition'>
										Delete
									</button>
								</div>
							</div>
							<div className='mt-2 text-gray-700'>
								<p>
									<strong>Name:</strong> {itinerary.name}
								</p>
								<p>
									<strong>Activities:</strong> {itinerary.activities.join(', ')}
								</p>
								<p>
									<strong>Locations:</strong> {itinerary.locations.join(', ')}
								</p>
								<p>
									<strong>Duration:</strong> {itinerary.duration}
								</p>
								<p>
									<strong>Language:</strong> {itinerary.language}
								</p>
								<p>
									<strong>Price:</strong> {itinerary.price}
								</p>
								<p>
									<strong>Rating:</strong> {itinerary.rating}
								</p>
								<p>
									<strong>Available Dates:</strong>{' '}
									{itinerary.availableDates.join(', ')}
								</p>
								<p>
									<strong>Accessibility:</strong> {itinerary.accessibility}
								</p>
								<p>
									<strong>Pickup:</strong> {itinerary.pickupLocation}
								</p>
								<p>
									<strong>Dropoff:</strong> {itinerary.dropoffLocation}
								</p>
								<p>
									<strong>Booking Open:</strong>{' '}
									{itinerary.bookingOpen ? 'Yes' : 'No'}
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ItinerariesComponent;
