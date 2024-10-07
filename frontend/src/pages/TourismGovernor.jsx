/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const TourismGovernor = () => {
	const [places, setPlaces] = useState([]); // List of museums/historical places
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		location: '',
		openingHours: '',
		foreignPrice: '',
		nativePrice: '',
		studentPrice: '',
		image: '',
		type: '', // New field for location type
		historicalPeriod: '', // New field for historical period tags
	}); // Form data for add/edit
	const [editingId, setEditingId] = useState(null); // ID of the place being edited

	// Fetch places on component mount
	useEffect(() => {
		fetchPlaces();
	}, []);

	const fetchPlaces = async () => {
		try {
			const response = await axios.get('http://localhost:5000/tourism');
			setPlaces(response.data);
		} catch (error) {
			console.error('Error fetching places:', error);
		}
	};

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Add or Update Place
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (editingId) {
			// Update existing place
			await axios.put(`http://localhost:5000/tourism/${editingId}`, formData);
		} else {
			// Create new place
			await axios.post('http://localhost:5000/tourism', formData);
		}
		fetchPlaces();
		resetForm();
	};

	// Edit Place
	const handleEdit = (place) => {
		setEditingId(place._id);
		setFormData({
			name: place.name,
			description: place.description,
			location: place.location,
			openingHours: place.openingHours,
			foreignPrice: place.foreignPrice,
			nativePrice: place.nativePrice,
			studentPrice: place.studentPrice,
			image: place.image,
			type: place.type, // Populate type in formData for editing
			historicalPeriod: place.historicalPeriod, // Populate historicalPeriod in formData for editing
		});
	};

	// Delete Place
	const handleDelete = async (id) => {
		await axios.delete(`http://localhost:5000/tourism/${id}`);
		fetchPlaces();
	};

	// Reset form after submit
	const resetForm = () => {
		setEditingId(null);
		setFormData({
			name: '',
			description: '',
			location: '',
			openingHours: '',
			foreignPrice: '',
			nativePrice: '',
			studentPrice: '',
			image: '',
			type: '', // Reset type field
			historicalPeriod: '', // Reset historical period field
		});
	};

	return (
		<div>
			<h1>Tourism Governor - Museums & Historical Places:</h1>

			{/* Form for adding or editing */}
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					name='name'
					placeholder='Name'
					value={formData.name}
					onChange={handleInputChange}
					required
				/>
				<input
					type='text'
					name='description'
					placeholder='Description'
					value={formData.description}
					onChange={handleInputChange}
					required
				/>
				<input
					type='text'
					name='location'
					placeholder='Location'
					value={formData.location}
					onChange={handleInputChange}
					required
				/>
				<input
					type='text'
					name='openingHours'
					placeholder='Opening Hours'
					value={formData.openingHours}
					onChange={handleInputChange}
					required
				/>
				<input
					type='number'
					name='foreignPrice'
					placeholder='Ticket Price (Foreigners)'
					value={formData.foreignPrice}
					onChange={handleInputChange}
					required
				/>
				<input
					type='number'
					name='nativePrice'
					placeholder='Ticket Price (Natives)'
					value={formData.nativePrice}
					onChange={handleInputChange}
					required
				/>
				<input
					type='number'
					name='studentPrice'
					placeholder='Ticket Price (Students)'
					value={formData.studentPrice}
					onChange={handleInputChange}
					required
				/>
				<input
					type='text'
					name='image'
					placeholder='Image URL'
					value={formData.image}
					onChange={handleInputChange}
					required
				/>

				{/* New Type Dropdown */}
				<select
					name='type'
					value={formData.type}
					onChange={handleInputChange}
					required>
					<option value=''>Select Type</option>
					<option value='Monuments'>Monuments</option>
					<option value='Museums'>Museums</option>
					<option value='Religious Sites'>Religious Sites</option>
					<option value='Palaces/Castles'>Palaces/Castles</option>
				</select>

				{/* New Historical Period Field */}
				<input
					type='text'
					name='historicalPeriod'
					placeholder='Historical Period (e.g., 19th Century)'
					value={formData.historicalPeriod}
					onChange={handleInputChange}
				/>

				<button type='submit'>{editingId ? 'Update' : 'Create '} Place</button>
				{editingId && <button onClick={resetForm}>Cancel Edit</button>}
			</form>

			{/* Display list of museums and historical places */}
			<ul>
				{places.map((place) => (
					<li key={place._id}>
						<h2>{place.name}</h2>
						<p>{place.description}</p>
						<p>Location: {place.location}</p>
						<p>Opening Hours: {place.openingHours}</p>
						<p>Type: {place.type}</p>
						<p>Historical Period: {place.historicalPeriod}</p>
						<p>
							Ticket Prices: Foreigner - ${place.foreignPrice}, Native - $
							{place.nativePrice}, Student - ${place.studentPrice}
						</p>
						<img
							src={place.image}
							alt={place.name}
							style={{ width: '200px', height: '150px' }}
						/>
						<button onClick={() => handleEdit(place)}>Edit</button>
						<button onClick={() => handleDelete(place._id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TourismGovernor;
