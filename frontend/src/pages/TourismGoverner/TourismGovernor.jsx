/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TourismGovernor = () => {
	const [places, setPlaces] = useState([]); // List of attractions
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		location: '',
		openingHours: '',
		ticketPrices: {
			foreigner: '',
			native: '',
			student: '',
		},
		tags: [], // New field for tags (references to Tag schema)
	}); // Form data for add/edit
	const [editingId, setEditingId] = useState(null); // ID of the place being edited
	const navigate = useNavigate();

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

	// Handle tag selection from the dropdown
	const handleTagChange = (e) => {
		const selectedTags = Array.from(
			e.target.selectedOptions,
			(option) => option.value
		);
		setFormData((prevState) => ({
			...prevState,
			tags: selectedTags,
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
				foreigner: place.ticketPrices.foreigner,
				native: place.ticketPrices.native,
				student: place.ticketPrices.student,
			},
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
				foreigner: '',
				native: '',
				student: '',
			},

			tags: [], // Reset tags
		});
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 flex items-center justify-center py-10 px-4'>
			<div className='container mx-auto'>
				<h1 className='text-3xl font-bold text-gray-800 text-center mb-8'>
					Tourism Governor - Museums & Historical Places
				</h1>

				{/* Form */}
				<div className='max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8'>
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
					<h2 className='text-2xl font-semibold text-gray-700 mb-6'>
						{editingId ? 'Edit Place' : 'Add a New Place'}
					</h2>
					<form onSubmit={handleSubmit}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<input
								type='text'
								name='name'
								placeholder='Name'
								value={formData.name}
								onChange={handleInputChange}
								required
								className='shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
							/>
							<input
								type='text'
								name='description'
								placeholder='Description'
								value={formData.description}
								onChange={handleInputChange}
								required
								className='shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
							/>
							<input
								type='text'
								name='location'
								placeholder='Location'
								value={formData.location}
								onChange={handleInputChange}
								required
								className='shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
							/>
							<input
								type='text'
								name='openingHours'
								placeholder='Opening Hours'
								value={formData.openingHours}
								onChange={handleInputChange}
								required
								className='shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
							/>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
							<input
								type='number'
								name='ticketPrices.foreigner'
								placeholder='Price (Foreigners)'
								value={formData.ticketPrices.foreigner}
								onChange={handleInputChange}
								required
								className='shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
							/>
							<input
								type='number'
								name='ticketPrices.native'
								placeholder='Price (Natives)'
								value={formData.ticketPrices.native}
								onChange={handleInputChange}
								required
								className='shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
							/>
							<input
								type='number'
								name='ticketPrices.student'
								placeholder='Price (Students)'
								value={formData.ticketPrices.student}
								onChange={handleInputChange}
								required
								className='shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
							/>

							<button
								type='submit'
								className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-lg'>
								{editingId ? 'Update Place' : 'Add Place'}
							</button>
						</div>
					</form>
				</div>

				{/* List */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
					{places.map((place) => (
						<div
							key={place._id}
							className='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300'>
							<h3 className='text-xl font-semibold text-gray-800 mb-2'>
								{place.name}
							</h3>
							<p className='text-gray-600 mb-4'>{place.description}</p>
							<div className='flex justify-between'>
								<button
									onClick={() => handleEdit(place)}
									className='bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded shadow'>
									Edit
								</button>
								<button
									onClick={() => handleDelete(place._id)}
									className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow'>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default TourismGovernor;
