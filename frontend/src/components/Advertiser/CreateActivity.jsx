/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ActivityForm = () => {
	const [formData, setFormData] = useState({
		date: '',
		time: '',
		price: '',
		priceRange: '',
		category: '',
		tags: '', // Changed to a single value
		specialDiscounts: '',
		bookingOpen: true,
		rating: '',
	});

	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get('http://localhost:3000/categories');
				setCategories(response.data);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};

		const fetchTags = async () => {
			try {
				const response = await axios.get('http://localhost:3000/pref-tags');
				setTags(response.data);
			} catch (error) {
				console.error('Error fetching tags:', error);
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
			console.log(token);
			const response = await axios.post(
				'http://localhost:3000/activities',
				formData,
				config
			);
			console.log('Activity created:', response.data);
		} catch (error) {
			console.error('Error creating activity:', error);
		}
	};

	const navigate = useNavigate();

	return (
		<div className='flex flex-col items-center w-full h-full space-y-3'>
			<button
				className='m-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200'
				onClick={() => navigate('all-activities')}>
				View All Activities
			</button>

			<form
				onSubmit={handleSubmit}
				className='max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6 w-3/4 h-3/4'>
				<h2 className='text-2xl font-bold text-center'>Create New Activity</h2>
				<div className='grid grid-cols-1 gap-4'>
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
					<label className='flex flex-col'>
						<span className='font-medium'>Tags:</span>
						<select
							name='preferenceTag'
							value={formData.preferenceTag} // Value should be a single tag ID
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
	);
};

export default ActivityForm;
