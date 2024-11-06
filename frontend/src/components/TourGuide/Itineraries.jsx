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
		rating: '',
		availableDates: [],
		accessibility: '',
		pickupLocation: '',
		dropoffLocation: '',
	});

	const [isEditing, setIsEditing] = useState(false);
	const [editItineraryId, setEditItineraryId] = useState(null);
	const [availableDatesError, setAvailableDatesError] = useState('');

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

		if (name === 'activities' || name === 'locations') {
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
				{/* Input fields for adding or editing itineraries */}
				{/* ... (existing input fields code) */}

				{/* Submit button */}
				<button
					type='submit'
					className='bg-blue-500 text-white px-4 py-2 rounded'>
					{isEditing ? 'Update Itinerary' : 'Add Itinerary'}
				</button>
			</form>

			<h3 className='text-xl'>Existing Itineraries</h3>
			{itineraries.length === 0 ? (
				<p>No itineraries available.</p>
			) : (
				<ul>
					{itineraries.map((itinerary) => (
						<li
							key={itinerary._id}
							className='mb-4'>
							{/* Display itinerary details */}
							<div className='border p-4 rounded'>
								<h4 className='text-lg font-semibold'>{itinerary.timeline}</h4>
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
									<strong>Pickup Location:</strong> {itinerary.pickupLocation}
								</p>
								<p>
									<strong>Dropoff Location:</strong> {itinerary.dropoffLocation}
								</p>

								{/* Edit and Delete buttons */}
								<div className='flex justify-between mt-4'>
									<button
										onClick={() => handleEdit(itinerary)}
										className='bg-yellow-500 text-white px-4 py-2 rounded'>
										Edit
									</button>
									<button
										onClick={() => handleDelete(itinerary._id)}
										className='bg-red-500 text-white px-4 py-2 rounded'>
										Delete
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default ItinerariesComponent;