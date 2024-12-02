/** @format */

// PromoCodeForm.jsx (ADMIN Component)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromoCodeForm = () => {
	const [code, setCode] = useState('');
	const [discount, setDiscount] = useState('');
	const [expirationDate, setExpirationDate] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [promoCodes, setPromoCodes] = useState([]);

	// Fetch promo codes
	useEffect(() => {
		const fetchPromoCodes = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(
					'http://localhost:3000/admins/promo-codes',
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setPromoCodes(response.data);
			} catch (error) {
				console.error('Error fetching promo codes:', error);
			}
		};

		fetchPromoCodes();
	}, [successMessage]);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		const promoCodeData = {
			code,
			discount: parseFloat(discount),
			expirationDate,
		};

		try {
			const token = localStorage.getItem('token');
			const response = await axios.post(
				'http://localhost:3000/admins/promo-codes',
				promoCodeData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setSuccessMessage(response.data.message);
			setErrorMessage('');
			setCode('');
			setDiscount('');
			setExpirationDate('');
		} catch (error) {
			setErrorMessage(
				error.response?.data?.message || 'Failed to create promo code'
			);
			setSuccessMessage('');
		}
	};

	// Handle promo code deletion
	const handleDelete = async (promoCodeId) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.delete(
				`http://localhost:3000/admins/promo-codes/${promoCodeId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setSuccessMessage(response.data.message);
			setErrorMessage('');
		} catch (error) {
			setErrorMessage(
				error.response?.data?.message || 'Failed to delete promo code'
			);
		}
	};

	return (
		<div className='max-w-3xl mx-auto p-6 bg-gray-50 shadow-md rounded-md'>
			<h3 className='text-2xl font-bold text-center text-gray-800 mb-6'>
				Create a Promo Code
			</h3>

			{/* Success and Error Messages */}
			{successMessage && (
				<p className='text-center text-green-600 mb-4'>{successMessage}</p>
			)}
			{errorMessage && (
				<p className='text-center text-red-600 mb-4'>{errorMessage}</p>
			)}

			{/* Form */}
			<form
				onSubmit={handleSubmit}
				className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Code:
					</label>
					<input
						type='text'
						value={code}
						onChange={(e) => setCode(e.target.value)}
						className='w-full border rounded-md p-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300'
						required
					/>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Discount (% or flat):
					</label>
					<input
						type='number'
						value={discount}
						onChange={(e) => setDiscount(e.target.value)}
						className='w-full border rounded-md p-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300'
						required
					/>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Expiration Date:
					</label>
					<input
						type='date'
						value={expirationDate}
						onChange={(e) => setExpirationDate(e.target.value)}
						className='w-full border rounded-md p-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300'
						required
					/>
				</div>

				<button
					type='submit'
					className='w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300'>
					Create Promo Code
				</button>
			</form>

			{/* Promo Code List */}
			<h3 className='text-xl font-bold text-gray-800 mt-10 mb-4'>
				Existing Promo Codes
			</h3>
			<ul className='space-y-3'>
				{promoCodes.map((promo) => (
					<li
						key={promo._id}
						className='flex justify-between items-center bg-white p-4 border rounded-md shadow-sm'>
						<span>
							<strong>Code:</strong> {promo.code}, <strong>Discount:</strong>{' '}
							{promo.discount}%, <strong>Expires:</strong>{' '}
							{new Date(promo.expirationDate).toLocaleDateString()}
						</span>
						<button
							onClick={() => handleDelete(promo._id)}
							className='bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-300'>
							Cancel
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PromoCodeForm;
