/** @format */

import React, { useState } from 'react';
import axios from 'axios';

const CreateTransportation = () => {
	const [formData, setFormData] = useState({
		vehicleType: '',
		availableSeats: '',
		pricePerSeat: '',
		location: '',
	});
	const [message, setMessage] = useState('');

	// Handle input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('token'); // Assumes the JWT token is stored in localStorage

			if (!token) {
				setMessage(
					"You're not logged in. Please login to create a transportation."
				);
				return;
			}

			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			// Send a request to create transportation without specifying the advertiser
			const response = await axios.post(
				'http://localhost:3000/transportation/create',
				formData,
				config
			);
			setMessage(response.data.message);
			setFormData({
				vehicleType: '',
				availableSeats: '',
				pricePerSeat: '',
				location: '',
			});
		} catch (error) {
			setMessage(
				error.response?.data?.message || 'Error creating transportation'
			);
			console.error('Error creating transportation:', error);
		}
	};

	return (
		<div className='max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md'>
			<h1 className='text-2xl font-bold mb-4'>Create Transportation</h1>
			{message && <p className='text-center text-red-500 mb-4'>{message}</p>}
			<form onSubmit={handleSubmit}>
				<label className='block mb-2'>
					<span className='font-semibold'>Vehicle Type:</span>
					<input
						type='text'
						name='vehicleType'
						value={formData.vehicleType}
						onChange={handleChange}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						placeholder='e.g., Bus, Car'
						required
					/>
				</label>
				<label className='block mb-2'>
					<span className='font-semibold'>Available Seats:</span>
					<input
						type='number'
						name='availableSeats'
						value={formData.availableSeats}
						onChange={handleChange}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						placeholder='Number of seats'
						required
					/>
				</label>
				<label className='block mb-2'>
					<span className='font-semibold'>Price per Seat:</span>
					<input
						type='number'
						name='pricePerSeat'
						value={formData.pricePerSeat}
						onChange={handleChange}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						placeholder='Price in USD'
						required
					/>
				</label>
				<label className='block mb-2'>
					<span className='font-semibold'>Location:</span>
					<input
						type='text'
						name='location'
						value={formData.location}
						onChange={handleChange}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						placeholder='Location'
						required
					/>
				</label>
				<button
					type='submit'
					className='mt-4 w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition duration-200'>
					Create Transportation
				</button>
			</form>
		</div>
	);
};

export default CreateTransportation;
