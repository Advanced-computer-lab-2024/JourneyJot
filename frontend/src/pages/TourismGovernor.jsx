/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const TourismGovernor = () => {
	const [places, setPlaces] = useState([]); // List of attractions
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		location: '',
		openingHours: '',
		ticketPrices: {
			foreign: '',
			native: '',
			student: '',
		},
		pictures: [], // Array for image URLs
		tags: [], // New field for tags (references to Tag schema)
	}); // Form data for add/edit
	const [editingId, setEditingId] = useState(null); // ID of the place being edited

	// Fetch places on component mount
	useEffect(() => {
		fetchPlaces();
	}, []);

	const fetchPlaces = async () => {
		try {
			const response = await axios.get('http://localhost:3000/attractions');
			setPlaces(response.data);
		} catch (error) {
			console.error('Error fetching places:', error);
		}
	};

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name.startsWith('ticketPrices.')) {
			const priceType = name.split('.')[1];
			setFormData((prevState) => ({
				...prevState,
				ticketPrices: {
					...prevState.ticketPrices,
					[priceType]: value,
				},
			}));
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	// Handle image addition to the pictures array
	const handleImageChange = (e) => {
		const { value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			pictures: [...prevState.pictures, value], // Add new image URL to the pictures array
		}));
	};

	// Add or Update Place
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let response;
			if (editingId) {
				// Update existing place
				response = await axios.put(
					`http://localhost:3000/attractions/${editingId}`,
					formData
				);
				console.log('Updated place:', response.data);
			} else {
				// Create new place
				response = await axios.post(
					'http://localhost:3000/attractions',
					formData
				);
				console.log('Created new place:', response.data);
			}
			fetchPlaces(); // Refresh the list of places
			resetForm(); // Reset form after submission
		} catch (error) {
			console.error(
				'Error submitting form:',
				error.response ? error.response.data : error.message
			);
		}
	};

	// Edit Place
	const handleEdit = (place) => {
		setEditingId(place._id);
		setFormData({
			name: place.name,
			description: place.description,
			location: place.location,
			openingHours: place.openingHours,
			ticketPrices: {
				foreign: place.ticketPrices.foreign,
				native: place.ticketPrices.native,
				student: place.ticketPrices.student,
			},
			pictures: place.pictures, // Populate pictures for editing
			tags: place.tags, // Populate tags for editing
		});
	};

	// Delete Place
	const handleDelete = async (id) => {
		try {
			await axios.delete(`http://localhost:3000/attractions/${id}`);
			fetchPlaces();
		} catch (error) {
			console.error('Error deleting place:', error);
		}
	};

	// Reset form after submit
	const resetForm = () => {
		setEditingId(null);
		setFormData({
			name: '',
			description: '',
			location: '',
			openingHours: '',
			ticketPrices: {
				foreign: '',
				native: '',
				student: '',
			},
			pictures: [], // Reset pictures array
			tags: [], // Reset tags
		});
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>
				Tourism Governor - Museums & Historical Places:
			</h1>

			{/* Form for adding or editing */}
			<form
				onSubmit={handleSubmit}
				className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
				<div className='mb-4'>
					<input
						type='text'
						name='name'
						placeholder='Name'
						value={formData.name}
						onChange={handleInputChange}
						required
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<input
						type='text'
						name='description'
						placeholder='Description'
						value={formData.description}
						onChange={handleInputChange}
						required
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<input
						type='text'
						name='location'
						placeholder='Location'
						value={formData.location}
						onChange={handleInputChange}
						required
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<input
						type='text'
						name='openingHours'
						placeholder='Opening Hours'
						value={formData.openingHours}
						onChange={handleInputChange}
						required
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<input
						type='number'
						name='ticketPrices.foreign'
						placeholder='Ticket Price (Foreigners)'
						value={formData.ticketPrices.foreign}
						onChange={handleInputChange}
						required
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<input
						type='number'
						name='ticketPrices.native'
						placeholder='Ticket Price (Natives)'
						value={formData.ticketPrices.native}
						onChange={handleInputChange}
						required
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<input
						type='number'
						name='ticketPrices.student'
						placeholder='Ticket Price (Students)'
						value={formData.ticketPrices.student}
						onChange={handleInputChange}
						required
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>

				{/* New Image URL Input */}
				<div className='mb-4'>
					<input
						type='text'
						name='image'
						placeholder='Image URL'
						onChange={handleImageChange} // Handle image addition
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>

				{/* Display all image URLs */}
				<div className='mb-4'>
					{formData.pictures.map((picture, index) => (
						<p
							key={index}
							className='text-gray-600'>
							{picture}
						</p>
					))}
				</div>

				{/* New Tags Dropdown */}
				<div className='mb-4'>
					<select
						name='tags'
						multiple
						value={formData.tags}
						onChange={(e) => {
							const selectedTags = Array.from(
								e.target.selectedOptions,
								(option) => option.value
							);
							setFormData({ ...formData, tags: selectedTags });
						}}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'>
						<option value='Monuments'>Monuments</option>
						<option value='Museums'>Museums</option>
						<option value='Religious Sites'>Religious Sites</option>
						<option value='Palaces/Castles'>Palaces/Castles</option>
					</select>
				</div>

				<div className='flex justify-between'>
					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
						{editingId ? 'Update' : 'Create '} Place
					</button>
					{editingId && (
						<button
							type='button'
							onClick={resetForm}
							className='bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
							Cancel Edit
						</button>
					)}
				</div>
			</form>

			{/* Display list of museums and historical places */}
			<ul className='list-disc pl-5'>
				{places.map((place) => (
					<li
						key={place._id}
						className='mb-4'>
						<h2 className='text-xl font-semibold'>{place.name}</h2>
						<p className='text-gray-700'>{place.description}</p>
						<p className='text-gray-600'>Location: {place.location}</p>
						<p className='text-gray-600'>Opening Hours: {place.openingHours}</p>
						<p className='text-gray-600'>Type: {place.tags.join(', ')}</p>
						<p className='text-gray-600'>
							Ticket Prices: Foreigner - ${place.ticketPrices.foreign}, Native -
							${place.ticketPrices.native}, Student - $
							{place.ticketPrices.student}
						</p>
						<div className='flex flex-wrap gap-2 mt-2'>
							{place.pictures.map((pic, index) => (
								<img
									key={index}
									src={pic}
									alt={place.name}
									className='w-32 h-24 object-cover rounded shadow-md'
								/>
							))}
						</div>
						<div className='mt-2'>
							<button
								onClick={() => handleEdit(place)}
								className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline mr-2'>
								Edit
							</button>
							<button
								onClick={() => handleDelete(place._id)}
								className='bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline'>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TourismGovernor;
