/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const PreferenceTagManagement = () => {
	const [tags, setTags] = useState([]);
	const [newTag, setNewTag] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editTagId, setEditTagId] = useState(null);

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
				console.error('Error fetching tags:', error);
			}
		};

		fetchTags();
	}, []);

	// Handle input change for the tag
	const handleInputChange = (e) => {
		setNewTag(e.target.value);
	};

	// Add a new tag
	const handleAddTag = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
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
		} catch (error) {
			console.error('Failed to add tag:', error);
		}
	};

	// Edit an existing tag
	const handleEditTag = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
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
		} catch (error) {
			console.error('Failed to edit tag:', error);
		}
	};

	// Start editing a tag
	const handleStartEdit = (tag) => {
		setNewTag(tag.name);
		setIsEditing(true);
		setEditTagId(tag._id);
	};

	// Delete a tag
	const handleDeleteTag = async (id) => {
		const token = localStorage.getItem('token');
		try {
			await axios.delete(`http://localhost:3000/pref-tags/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setTags((prev) => prev.filter((tag) => tag._id !== id));
		} catch (error) {
			console.error('Failed to delete tag:', error);
		}
	};

	return (
		<div className='p-8'>
			<h2 className='text-2xl mb-4'>Preference Tag Management</h2>

			<form
				onSubmit={isEditing ? handleEditTag : handleAddTag}
				className='mb-6'>
				<div className='mb-4'>
					<label>Tag Name</label>
					<input
						type='text'
						value={newTag}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded'
						placeholder='Enter tag name'
						required
					/>
				</div>
				<button
					type='submit'
					className='bg-green-500 text-white p-2 rounded'>
					{isEditing ? 'Update Tag' : 'Add Tag'}
				</button>
			</form>

			<h3 className='text-xl mb-4'>Current Tags</h3>
			{tags.length > 0 ? (
				<ul className='list-disc pl-5'>
					{tags.map((tag) => (
						<li
							key={tag._id}
							className='mb-2 flex justify-between'>
							<span>{tag.name}</span>
							<div>
								<button
									className='bg-yellow-500 text-white p-1 rounded mr-2'
									onClick={() => handleStartEdit(tag)}>
									Edit
								</button>
								<button
									className='bg-red-500 text-white p-1 rounded'
									onClick={() => handleDeleteTag(tag._id)}>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p>No tags available.</p>
			)}
		</div>
	);
};

export default PreferenceTagManagement;
