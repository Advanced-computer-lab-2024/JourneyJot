/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressManagement = () => {
	const [formData, setFormData] = useState({
		address: '',
		city: '',
		state: '',
		zip: '',
		country: '',
	});

	const [addresses, setAddresses] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [message, setMessage] = useState('');

	// Fetch addresses when the component loads
	useEffect(() => {
		const fetchAddresses = async () => {
			try {
				// Retrieve token from localStorage
				const token = localStorage.getItem('token');

				// Check if token exists
				if (!token) {
					setMessage('No token found. Please log in.');
					return;
				}

				// Make API call to fetch addresses
				const response = await axios.get('http://localhost:3000/address', {
					headers: { Authorization: `Bearer ${token}` },
				});

				// Update the state with fetched addresses
				setAddresses(response.data);
			} catch (error) {
				// Handle possible errors
				if (error.response) {
					// Error from the server
					setMessage(
						error.response.data.message || 'Error fetching addresses.'
					);
				} else if (error.request) {
					// No response received
					setMessage('No response from the server. Please try again.');
				} else {
					// Error setting up the request
					setMessage('Error setting up the request.');
				}
			}
		};

		fetchAddresses();
	}, []);

	// Handle form input changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle form submission to add an address
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('token');
			const response = await axios.post(
				'http://localhost:3000/address',
				formData,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setMessage(response.data.message);
			setAddresses((prev) => [...prev, response.data.address]); // Update address list
			setFormData({ address: '', city: '', state: '', zip: '', country: '' }); // Reset form
		} catch (error) {
			setMessage(error.response?.data?.error || 'Error adding address.');
		}
	};

	// Handle selecting an address
	const handleSelect = (address) => {
		setSelectedAddress(address);
		setMessage(`Selected Address: ${address.address}, ${address.city}`);
	};

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-6 text-center'>
				Address Management
			</h1>

			{/* Form for Adding Address */}
			<div className='mb-8 p-6 bg-white shadow-md rounded-md'>
				<h2 className='text-lg font-semibold mb-4'>Add Address</h2>
				<form
					onSubmit={handleSubmit}
					className='space-y-4'>
					<input
						type='text'
						name='address'
						placeholder='Address'
						value={formData.address}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
					/>
					<input
						type='text'
						name='city'
						placeholder='City'
						value={formData.city}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
					/>
					<input
						type='text'
						name='state'
						placeholder='State'
						value={formData.state}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
					/>
					<input
						type='text'
						name='zip'
						placeholder='ZIP Code'
						value={formData.zip}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
					/>
					<input
						type='text'
						name='country'
						placeholder='Country'
						value={formData.country}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
					/>
					<button
						type='submit'
						className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300'>
						Add Address
					</button>
				</form>
			</div>

			{/* List of Addresses */}
			<div className='mb-8 p-6 bg-white shadow-md rounded-md'>
				<h2 className='text-lg font-semibold mb-4'>My Addresses</h2>
				{addresses.length > 0 ? (
					<ul className='space-y-4'>
						{addresses.map((address) => (
							<li
								key={address._id}
								className='p-4 bg-gray-100 rounded-md shadow-sm flex items-center justify-between'>
								<p>
									<span className='font-semibold'>Address:</span>{' '}
									{address.address}, {address.city}, {address.state},{' '}
									{address.zip}, {address.country}
								</p>
								<button
									onClick={() => handleSelect(address)}
									className='bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300'>
									Select
								</button>
							</li>
						))}
					</ul>
				) : (
					<p className='text-gray-500'>No addresses found.</p>
				)}
			</div>

			{/* Message Display */}
			{message && <p className='text-blue-600 text-center mb-6'>{message}</p>}

			{/* Selected Address */}
			{selectedAddress && (
				<div className='p-6 bg-white shadow-md rounded-md'>
					<h3 className='text-lg font-semibold mb-4'>Selected Address</h3>
					<p>
						{selectedAddress.address}, {selectedAddress.city},{' '}
						{selectedAddress.state}, {selectedAddress.zip},{' '}
						{selectedAddress.country}
					</p>
				</div>
			)}
		</div>
	);
};

export default AddressManagement;
