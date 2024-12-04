/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ActivityForm = () => {
	const [formData, setFormData] = useState({
		name: '',
		date: '',
		time: '',
		price: '',
		priceRange: '',
		category: '',
		preferenceTag: '',
		specialDiscounts: '',
		bookingOpen: true,
		rating: '',
	});

	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get('http://localhost:3000/categories');
				setCategories(response.data);
			} catch (error) {
				setError('Failed to fetch categories.');
			}
		};

		const fetchTags = async () => {
			try {
				const response = await axios.get('http://localhost:3000/pref-tags');
				setTags(response.data);
			} catch (error) {
				setError('Failed to fetch tags.');
			}
		};

		fetchCategories();
		fetchTags();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please log in again.');
			}

			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			const response = await axios.post(
				'http://localhost:3000/activities',
				formData,
				config
			);

			setSuccess('Activity created successfully!');
			setFormData({
				name: '',
				date: '',
				time: '',
				price: '',
				priceRange: '',
				category: '',
				preferenceTag: '',
				specialDiscounts: '',
				bookingOpen: true,
				rating: '',
			});
		} catch (error) {
			setError('Failed to create activity. Please try again.');
		}
	};

	const navigate = useNavigate();

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='flex flex-col items-center w-full h-full space-y-3'>
				<button
					className='m-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200'
					onClick={() => navigate('all-activities')}>
					View All Activities
				</button>

				<form
					onSubmit={handleSubmit}
					className='max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6 w-3/4'>
					<h2 className='text-2xl font-bold text-center'>
						Create New Activity
					</h2>

					{/* Error and Success Messages */}
					{error && (
						<div className='text-red-600 bg-red-100 p-3 rounded mb-4'>
							{error}
						</div>
					)}
					{success && (
						<div className='text-green-600 bg-green-100 p-3 rounded mb-4'>
							{success}
						</div>
					)}

					<div className='grid grid-cols-1 gap-4'>
						{/* Name */}
						<label className='flex flex-col'>
							<span className='font-medium'>Name:</span>
							<input
								type='text'
								name='name'
								value={formData.name}
								onChange={handleChange}
								required
								className='border rounded p-2 mt-1'
							/>
						</label>

						{/* Date */}
						<label className='flex flex-col'>
							<span className='font-medium'>Date:</span>
							<input
								type='date'
								name='date'
								value={formData.date}
								onChange={handleChange}
								required
								className='border rounded p-2 mt-1'
							/>
						</label>

						{/* Time */}
						<label className='flex flex-col'>
							<span className='font-medium'>Time:</span>
							<input
								type='time'
								name='time'
								value={formData.time}
								onChange={handleChange}
								required
								className='border rounded p-2 mt-1'
							/>
						</label>

						{/* Price */}
						<label className='flex flex-col'>
							<span className='font-medium'>Price:</span>
							<input
								type='number'
								name='price'
								value={formData.price}
								onChange={handleChange}
								required
								className='border rounded p-2 mt-1'
							/>
						</label>

						{/* Price Range */}
						<label className='flex flex-col'>
							<span className='font-medium'>Price Range:</span>
							<input
								type='text'
								name='priceRange'
								value={formData.priceRange}
								onChange={handleChange}
								className='border rounded p-2 mt-1'
							/>
						</label>

						{/* Category */}
						<label className='flex flex-col'>
							<span className='font-medium'>Category:</span>
							<select
								name='category'
								value={formData.category}
								onChange={handleChange}
								required
								className='border rounded p-2 mt-1'>
								<option value=''>Select a category</option>
								{categories.map((category) => (
									<option
										key={category._id}
										value={category._id}>
										{category.name}
									</option>
								))}
							</select>
						</label>

						{/* Tags */}
						<label className='flex flex-col'>
							<span className='font-medium'>Tags:</span>
							<select
								name='preferenceTag'
								value={formData.preferenceTag}
								onChange={handleChange}
								className='border rounded p-2 mt-1'>
								<option value=''>Select a Tag</option>
								{tags.map((tag) => (
									<option
										key={tag._id}
										value={tag._id}>
										{tag.name}
									</option>
								))}
							</select>
						</label>

						{/* Special Discounts */}
						<label className='flex flex-col'>
							<span className='font-medium'>Special Discounts:</span>
							<input
								type='text'
								name='specialDiscounts'
								value={formData.specialDiscounts}
								onChange={handleChange}
								className='border rounded p-2 mt-1'
							/>
						</label>

						{/* Booking Open */}
						<label className='flex items-center'>
							<input
								type='checkbox'
								name='bookingOpen'
								checked={formData.bookingOpen}
								onChange={(e) =>
									setFormData({ ...formData, bookingOpen: e.target.checked })
								}
								className='mr-2'
							/>
							<span className='font-medium'>Booking Open</span>
						</label>

						{/* Rating */}
						<label className='flex flex-col'>
							<span className='font-medium'>Rating:</span>
							<input
								type='number'
								name='rating'
								value={formData.rating}
								min='1'
								max='5'
								onChange={handleChange}
								className='border rounded p-2 mt-1'
							/>
						</label>
					</div>

					<button
						type='submit'
						className='w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition'>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default ActivityForm;
