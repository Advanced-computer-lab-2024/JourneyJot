/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const ItinerariesComponent = () => {
	const [itineraries, setItineraries] = useState([]);
	const [newItinerary, setNewItinerary] = useState({
		activities: [],
		locations: [],
		timeline: '',
		duration: '',
		language: '',
		price: '',
		availableDates: [],
		accessibility: '',
		pickupLocation: '',
		dropoffLocation: '',
	});

	const [isEditing, setIsEditing] = useState(false);
	const [editItineraryId, setEditItineraryId] = useState(null);

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
					'http://localhost:3000/itineraries/',
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
		const { name, value } = e.target;
		// Handle array input for activities and locations
		if (name === 'activities' || name === 'locations') {
			setNewItinerary({
				...newItinerary,
				[name]: value.split(',').map((item) => item.trim()), // Convert comma-separated input to array
			});
		} else {
			setNewItinerary({ ...newItinerary, [name]: value });
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
				activities: [],
				locations: [],
				timeline: '',
				duration: '',
				language: '',
				price: '',
				availableDates: [],
				accessibility: '',
				pickupLocation: '',
				dropoffLocation: '',
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
		<div className='p-8'>
			<h2 className='text-2xl mb-4'>Itineraries</h2>

			<form
				onSubmit={handleSubmit}
				className='mb-6'>
				<div className='mb-4'>
					<label>Activities</label>
					<input
						type='text'
						name='activities'
						value={newItinerary.activities.join(', ')} // Convert array to string for display
						onChange={handleInputChange}
						placeholder='Activities (comma separated)'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label>Locations</label>
					<input
						type='text'
						name='locations'
						value={newItinerary.locations.join(', ')} // Convert array to string for display
						onChange={handleInputChange}
						placeholder='Locations (comma separated)'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label>Timeline</label>
					<input
						type='text'
						name='timeline'
						value={newItinerary.timeline}
						onChange={handleInputChange}
						placeholder='Timeline'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label>Duration</label>
					<input
						type='text'
						name='duration'
						value={newItinerary.duration}
						onChange={handleInputChange}
						placeholder='Duration'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label>Language</label>
					<input
						type='text'
						name='language'
						value={newItinerary.language}
						onChange={handleInputChange}
						placeholder='Language'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label>Price</label>
					<input
						type='number'
						name='price'
						value={newItinerary.price}
						onChange={handleInputChange}
						placeholder='Price'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label>Available Dates</label>
					<input
						type='text'
						name='availableDates'
						value={newItinerary.availableDates.join(', ')} // Convert array to string for display
						onChange={handleInputChange}
						placeholder='Available Dates (comma separated)'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label>Accessibility</label>
					<input
						type='text'
						name='accessibility'
						value={newItinerary.accessibility}
						onChange={handleInputChange}
						placeholder='Accessibility'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label>Pickup Location</label>
					<input
						type='text'
						name='pickupLocation'
						value={newItinerary.pickupLocation}
						onChange={handleInputChange}
						placeholder='Pickup Location'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label>Dropoff Location</label>
					<input
						type='text'
						name='dropoffLocation'
						value={newItinerary.dropoffLocation}
						onChange={handleInputChange}
						placeholder='Dropoff Location'
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<button
						type='submit'
						className='bg-blue-500 text-white p-2 rounded'>
						{isEditing ? 'Update Itinerary' : 'Create Itinerary'}
					</button>
				</div>
			</form>

			{/* List of itineraries */}
			<div>
				<h3 className='text-xl mb-4'>All Itineraries</h3>
				{itineraries.length > 0 ? (
					<ul>
						{itineraries.map((itinerary) => (
							<li
								key={itinerary._id}
								className='mb-4 p-4 border border-gray-300 rounded'>
								<p>
									<strong>Activities:</strong> {itinerary.activities.join(', ')}
								</p>
								<p>
									<strong>Locations:</strong> {itinerary.locations.join(', ')}
								</p>
								<p>
									<strong>Timeline:</strong> {itinerary.timeline}
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
									<strong>Available Dates:</strong>{' '}
									{itinerary.availableDates.join(', ')}
								</p>
								<p>
									<strong>Accessibility:</strong> {itinerary.accessibility}
								</p>
								<p>
									<strong>Pickup Location:</strong> {itinerary.pickupLocation}
								</p>
								<p>
									<strong>Dropoff Location:</strong> {itinerary.dropoffLocation}
								</p>
								<button
									onClick={() => handleEdit(itinerary)}
									className='mr-2 text-blue-500'>
									Edit
								</button>
								<button
									onClick={() => handleDelete(itinerary._id)}
									className='text-red-500'>
									Delete
								</button>
							</li>
						))}
					</ul>
				) : (
					<p>No itineraries available.</p>
				)}
			</div>
		</div>
	);
};

export default ItinerariesComponent;
