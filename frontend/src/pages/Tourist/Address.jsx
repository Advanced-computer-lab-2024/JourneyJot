/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressManagement = () => {
	// State for form data, address list, selected address, and messages
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

	// Fetch addresses when the component mounts
	useEffect(() => {
		const fetchAddresses = async () => {
			try {
				const token = localStorage.getItem('token');

				if (!token) {
					setMessage('No token found. Please log in.');
					return;
				}

				const response = await axios.get('http://localhost:3000/address', {
					headers: { Authorization: `Bearer ${token}` },
				});

				setAddresses(response.data); // Update addresses
			} catch (error) {
				// Error handling
				const errorMessage = error.response
					? error.response.data.message || 'Error fetching addresses.'
					: 'Unable to connect to the server.';
				setMessage(errorMessage);
			}
		};

		fetchAddresses();
	}, []);

	// Update form data on input change
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Submit new address
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

			setMessage(response.data.message); // Show success message
			setAddresses((prev) => [...prev, response.data.address]); // Add new address to list
			setFormData({ address: '', city: '', state: '', zip: '', country: '' }); // Reset form
		} catch (error) {
			// Error handling
			setMessage(error.response?.data?.error || 'Error adding address.');
		}
	};

	// Select an address
	const handleSelect = (address) => {
		setSelectedAddress(address);
		setMessage(`Selected Address: ${address.address}, ${address.city}`);
	};

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-6 text-center'>
				Address Management
			</h1>

			{/* Form Section */}
			<div className='mb-8 p-6 bg-white shadow-md rounded-md'>
				<h2 className='text-lg font-semibold mb-4'>Add Address</h2>
				<form
					onSubmit={handleSubmit}
					className='space-y-4'>
					{/* Input Fields */}
					{['address', 'city', 'state', 'zip', 'country'].map((field) => (
						<input
							key={field}
							type='text'
							name={field}
							placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
							value={formData[field]}
							onChange={handleChange}
							required
							className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
						/>
					))}
					{/* Submit Button */}
					<button
						type='submit'
						className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300'>
						Add Address
					</button>
				</form>
			</div>

			{/* Address List */}
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
								{/* Select Button */}
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

			{/* Selected Address Details */}
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
