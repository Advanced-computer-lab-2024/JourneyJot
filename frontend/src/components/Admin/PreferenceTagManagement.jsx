/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const PreferenceTagManagement = () => {
	const [tags, setTags] = useState([]);
	const [newTag, setNewTag] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editTagId, setEditTagId] = useState(null);
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// Fetch tags on component mount
	useEffect(() => {
		const fetchTags = async () => {
			const token = localStorage.getItem('token');
			try {
				const response = await axios.get('http://localhost:3000/pref-tags', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setTags(response.data);
			} catch (error) {
				setError('Error fetching tags.');
				console.error('Error fetching tags:', error);
			}
		};

		fetchTags();
	}, []);

	// Handle input change for the tag
	const handleInputChange = (e) => {
		setNewTag(e.target.value);
		setError('');
		setSuccessMessage('');
	};

	// Add a new tag
	const handleAddTag = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
		if (!newTag) {
			setError('Tag name cannot be empty.');
			return;
		}
		try {
			const response = await axios.post(
				'http://localhost:3000/pref-tags',
				{ name: newTag },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setTags((prev) => [...prev, response.data.tag]);
			setNewTag('');
			setSuccessMessage('Tag added successfully.');
		} catch (error) {
			setError('Failed to add tag.');
			console.error('Failed to add tag:', error);
		}
	};

	// Edit an existing tag
	const handleEditTag = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
		if (!newTag) {
			setError('Tag name cannot be empty.');
			return;
		}
		try {
			const response = await axios.put(
				`http://localhost:3000/pref-tags/${editTagId}`,
				{ name: newTag },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setTags((prev) =>
				prev.map((tag) => (tag._id === editTagId ? response.data.tag : tag))
			);
			setNewTag('');
			setIsEditing(false);
			setEditTagId(null);
			setSuccessMessage('Tag updated successfully.');
		} catch (error) {
			setError('Failed to edit tag.');
			console.error('Failed to edit tag:', error);
		}
	};

	// Start editing a tag
	const handleStartEdit = (tag) => {
		setNewTag(tag.name);
		setIsEditing(true);
		setEditTagId(tag._id);
		setError('');
		setSuccessMessage('');
	};

	// Delete a tag
	const handleDeleteTag = async (id) => {
		const token = localStorage.getItem('token');
		try {
			await axios.delete(`http://localhost:3000/pref-tags/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setTags((prev) => prev.filter((tag) => tag._id !== id));
			setSuccessMessage('Tag deleted successfully.');
		} catch (error) {
			setError('Failed to delete tag.');
			console.error('Failed to delete tag:', error);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='w-full max-w-lg p-8 bg-white rounded-lg shadow-lg'>
				<h2 className='text-2xl font-semibold mb-6 text-center'>
					Preference Tag Management
				</h2>

				{/* Form Section */}
				<form
					onSubmit={isEditing ? handleEditTag : handleAddTag}
					className='space-y-4'>
					<div className='mb-4'>
						<label className='block text-lg font-medium text-gray-700'>
							Tag Name
						</label>
						<input
							type='text'
							value={newTag}
							onChange={handleInputChange}
							className='w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
							placeholder='Enter tag name'
							required
						/>
					</div>

					<button
						type='submit'
						className='w-full bg-green-500 text-white p-3 rounded-lg shadow hover:bg-green-600 transition duration-200'>
						{isEditing ? 'Update Tag' : 'Add Tag'}
					</button>
				</form>

				{/* Error and Success Messages */}
				{error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
				{successMessage && (
					<p className='text-green-500 mt-4 text-center'>{successMessage}</p>
				)}

				{/* Tags List */}
				<h3 className='text-xl font-semibold mt-8 mb-4'>Current Tags</h3>
				{tags.length > 0 ? (
					<ul className='space-y-3'>
						{tags.map((tag) => (
							<li
								key={tag._id}
								className='flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow'>
								<span className='text-lg text-gray-700'>{tag.name}</span>
								<div className='flex space-x-3'>
									<button
										className='bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition duration-200'
										onClick={() => handleStartEdit(tag)}>
										Edit
									</button>
									<button
										className='bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition duration-200'
										onClick={() => handleDeleteTag(tag._id)}>
										Delete
									</button>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className='text-center text-gray-500'>No tags available.</p>
				)}
			</div>
		</div>
	);
};

export default PreferenceTagManagement;
