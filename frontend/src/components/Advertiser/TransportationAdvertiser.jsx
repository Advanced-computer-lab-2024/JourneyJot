/** @format */

import React, { useState } from 'react';
import axios from 'axios';
import { FaBus, FaCar, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

const CreateTransportation = () => {
	const [formData, setFormData] = useState({
		vehicleType: '',
		availableSeats: '',
		pricePerSeat: '',
		location: '',
	});
	const [message, setMessage] = useState({ type: '', text: '' });
	const [loading, setLoading] = useState(false);

	// Handle input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage({ type: '', text: '' });
		try {
			const token = localStorage.getItem('token'); // Assumes the JWT token is stored in localStorage

			if (!token) {
				setMessage({
					type: 'error',
					text: "You're not logged in. Please login to create a transportation.",
				});
				setLoading(false);
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
			setMessage({
				type: 'success',
				text: response.data.message || 'Transportation created successfully!',
			});
			setFormData({
				vehicleType: '',
				availableSeats: '',
				pricePerSeat: '',
				location: '',
			});
		} catch (error) {
			setMessage({
				type: 'error',
				text:
					error.response?.data?.message ||
					'Error creating transportation. Please try again.',
			});
			console.error('Error creating transportation:', error);
		} finally {
			setLoading(false);
		}
	};

	// Get icon based on vehicle type
	const getVehicleIcon = (type) => {
		switch (type.toLowerCase()) {
			case 'bus':
				return <FaBus className='text-blue-500 mr-2' />;
			case 'car':
				return <FaCar className='text-green-500 mr-2' />;
			default:
				return <FaBus className='text-gray-500 mr-2' />;
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center p-4'>
			<div className='max-w-md w-full bg-white rounded-xl shadow-2xl p-8'>
				<h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>
					Create Transportation
				</h1>

				{/* Success and Error Messages */}
				{message.text && (
					<div
						className={`mb-4 px-4 py-3 rounded-md text-sm ${
							message.type === 'success'
								? 'bg-green-100 text-green-700'
								: 'bg-red-100 text-red-700'
						}`}
						role='alert'>
						{message.text}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-4'>
					{/* Vehicle Type */}
					<div className='relative'>
						<label
							htmlFor='vehicleType'
							className='block text-sm font-semibold text-gray-700 mb-1'>
							Vehicle Type
						</label>
						<select
							id='vehicleType'
							name='vehicleType'
							value={formData.vehicleType}
							onChange={handleChange}
							className='w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500'
							required>
							<option value=''>Select Vehicle Type</option>
							<option value='Bus'>Bus</option>
							<option value='Car'>Car</option>
							<option value='Van'>Van</option>
							<option value='Minibus'>Minibus</option>
							<option value='Train'>Train</option>
						</select>
						{/* Icon */}
						{formData.vehicleType && (
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								{getVehicleIcon(formData.vehicleType)}
							</div>
						)}
					</div>

					{/* Available Seats */}
					<div className='relative'>
						<label
							htmlFor='availableSeats'
							className='block text-sm font-semibold text-gray-700 mb-1'>
							Available Seats
						</label>
						<input
							type='number'
							id='availableSeats'
							name='availableSeats'
							value={formData.availableSeats}
							onChange={handleChange}
							className='w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500'
							placeholder='Number of seats'
							required
							min='1'
						/>
						{/* Icon */}
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<FaBus className='text-blue-500' />
						</div>
					</div>

					{/* Price per Seat */}
					<div className='relative'>
						<label
							htmlFor='pricePerSeat'
							className='block text-sm font-semibold text-gray-700 mb-1'>
							Price per Seat (USD)
						</label>
						<input
							type='number'
							id='pricePerSeat'
							name='pricePerSeat'
							value={formData.pricePerSeat}
							onChange={handleChange}
							className='w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500'
							placeholder='Price in USD'
							required
							min='0'
							step='0.01'
						/>
						{/* Icon */}
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<FaDollarSign className='text-green-500' />
						</div>
					</div>

					{/* Location */}
					<div className='relative'>
						<label
							htmlFor='location'
							className='block text-sm font-semibold text-gray-700 mb-1'>
							Location
						</label>
						<input
							type='text'
							id='location'
							name='location'
							value={formData.location}
							onChange={handleChange}
							className='w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500'
							placeholder='Location'
							required
						/>
						{/* Icon */}
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<FaMapMarkerAlt className='text-red-500' />
						</div>
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className={`w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ${
							loading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						disabled={loading}>
						{loading ? (
							<>
								<svg
									className='animate-spin h-5 w-5 mr-3 text-white'
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
								Creating...
							</>
						) : (
							'Create Transportation'
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateTransportation;
