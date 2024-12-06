/** @format */

import React, { useState, useEffect } from 'react';

const EditActivity = ({
	activity,
	onClose,
	onUpdate,
	categories = [],
	tags = [],
}) => {
	const [formData, setFormData] = useState({
		name: activity?.name || '',
		date: activity?.date || '',
		time: activity?.time || '',
		price: activity?.price || '',
		priceRange: activity?.priceRange || '',
		category: activity?.category?.name || '',
		preferenceTag: activity?.preferenceTag || '', // Changed to hold a single value
		specialDiscounts: activity?.specialDiscounts || '',
		bookingOpen: activity?.bookingOpen || false,
		rating: activity?.rating || '',
	});

	useEffect(() => {
		setFormData({
			name: activity?.name || '',
			date: activity?.date || '',
			time: activity?.time || '',
			price: activity?.price || '',
			priceRange: activity?.priceRange || '',
			category: activity?.category?.name || '',
			preferenceTag: activity?.preferenceTag || '', // Ensure preferenceTag is a single value
			specialDiscounts: activity?.specialDiscounts || '',
			bookingOpen: activity?.bookingOpen || false,
			rating: activity?.rating || '',
		});
	}, [activity]);

	const handleChange = (e) => {
		const { name, value, type } = e.target;

		if (type === 'checkbox') {
			setFormData((prevData) => ({
				...prevData,
				[name]: e.target.checked,
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Merging original activity with updated form data
		onUpdate({ ...activity, ...formData });
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-lg max-w-lg w-full'>
			<h2 className='text-lg font-bold mb-4'>Edit Activity</h2>
			<form onSubmit={handleSubmit}>
				{/* Name Field */}
				<label className='block mb-2'>
					Name:
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={handleChange}
						className='border rounded p-2 w-full'
					/>
				</label>

				{/* Date Field */}
				<label className='block mb-2'>
					Date:
					<input
						type='date'
						name='date'
						value={formData.date}
						onChange={handleChange}
						className='border rounded p-2 w-full'
					/>
				</label>

				{/* Time Field */}
				<label className='block mb-2'>
					Time:
					<input
						type='time'
						name='time'
						value={formData.time}
						onChange={handleChange}
						className='border rounded p-2 w-full'
					/>
				</label>

				{/* Price Field */}
				<label className='block mb-2'>
					Price:
					<input
						type='number'
						name='price'
						value={formData.price}
						onChange={handleChange}
						className='border rounded p-2 w-full'
					/>
				</label>

				{/* Price Range Field */}
				<label className='block mb-2'>
					Price Range:
					<input
						type='text'
						name='priceRange'
						value={formData.priceRange}
						onChange={handleChange}
						className='border rounded p-2 w-full'
					/>
				</label>

				{/* Category Field */}
				<label className='block mb-2'>
					Category:
					<select
						name='category'
						value={formData.category}
						onChange={handleChange}
						className='border rounded p-2 w-full'>
						<option value=''>Select Category</option>
						{Array.isArray(categories) &&
							categories.map((category) => (
								<option
									key={category._id}
									value={category.name}>
									{category.name}
								</option>
							))}
					</select>
				</label>

				{/* Preference Tag Field */}
				<label className='block mb-2'>
					Preference Tag:
					<select
						name='preferenceTag'
						value={formData.preferenceTag}
						onChange={handleChange}
						className='border rounded p-2 w-full'>
						<option value=''>Select Preference Tag</option>
						{Array.isArray(tags) &&
							tags.map((tag) => (
								<option
									key={tag._id}
									value={tag.name}>
									{tag.name}
								</option>
							))}
					</select>
				</label>

				{/* Booking Open Field */}
				<label className='block mb-2'>
					Booking Open:
					<input
						type='checkbox'
						name='bookingOpen'
						checked={formData.bookingOpen}
						onChange={handleChange}
						className='border rounded p-2'
					/>
				</label>

				{/* Rating Field */}
				<label className='block mb-2'>
					Rating:
					<input
						type='number'
						name='rating'
						value={formData.rating}
						onChange={handleChange}
						className='border rounded p-2 w-full'
						min='0'
						max='5'
					/>
				</label>

				{/* Submit & Close Buttons */}
				<div className='flex justify-end space-x-2 mt-4'>
					<button
						type='button'
						onClick={onClose}
						className='bg-gray-500 text-white px-4 py-2 rounded'>
						Close
					</button>
					<button
						type='submit'
						className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
						Update Activity
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditActivity;
