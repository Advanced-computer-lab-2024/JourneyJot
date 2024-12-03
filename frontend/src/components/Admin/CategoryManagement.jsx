/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManagement = () => {
	const [categories, setCategories] = useState([]);
	const [newCategory, setNewCategory] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editCategoryId, setEditCategoryId] = useState(null);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	// Fetch categories on component mount
	useEffect(() => {
		const fetchCategories = async () => {
			const token = localStorage.getItem('token');
			try {
				const response = await axios.get('http://localhost:3000/categories', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setCategories(response.data || []);
			} catch (error) {
				setError('Failed to load categories.');
			}
		};

		fetchCategories();
	}, []);

	// Handle input change for the category
	const handleInputChange = (e) => {
		setNewCategory(e.target.value);
	};

	// Add or edit category
	const handleCategorySubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
		const url = isEditing
			? `http://localhost:3000/categories/${editCategoryId}`
			: 'http://localhost:3000/categories';
		const method = isEditing ? 'put' : 'post';
		const data = { name: newCategory };

		try {
			const response = await axios({
				url,
				method,
				data,
				headers: { Authorization: `Bearer ${token}` },
			});
			setCategories((prev) =>
				isEditing
					? prev.map((cat) =>
							cat._id === editCategoryId ? response.data.category : cat
					  )
					: [...prev, response.data.category]
			);
			setNewCategory('');
			setIsEditing(false);
			setEditCategoryId(null);
			setSuccess(
				isEditing
					? 'Category updated successfully!'
					: 'Category added successfully!'
			);
			setError(null);
		} catch {
			setError('Failed to save category.');
		}
	};

	// Delete category
	const handleDeleteCategory = async (id) => {
		const token = localStorage.getItem('token');
		try {
			await axios.delete(`http://localhost:3000/categories/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setCategories((prev) => prev.filter((cat) => cat._id !== id));
			setSuccess('Category deleted successfully!');
			setError(null);
		} catch {
			setError('Failed to delete category.');
		}
	};

	// Start editing
	const handleStartEdit = (category) => {
		setNewCategory(category.name);
		setIsEditing(true);
		setEditCategoryId(category._id);
	};

	return (
		<div className='p-8 max-w-2xl mx-auto bg-gray-50 shadow-md rounded'>
			<h2 className='text-2xl font-bold mb-6 text-gray-800'>
				Category Management
			</h2>
			{error && <p className='text-red-600 mb-4'>{error}</p>}
			{success && <p className='text-green-600 mb-4'>{success}</p>}

			<form
				onSubmit={handleCategorySubmit}
				className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Category Name
					</label>
					<input
						type='text'
						value={newCategory}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded focus:ring-blue-300 focus:outline-none'
						placeholder='Enter category name'
						required
					/>
				</div>
				<button
					type='submit'
					className='px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition'>
					{isEditing ? 'Update Category' : 'Add Category'}
				</button>
			</form>

			<h3 className='text-xl font-bold mt-8 mb-4 text-gray-800'>
				Current Categories
			</h3>
			<ul className='space-y-2'>
				{categories.length > 0 ? (
					categories.map((category) => (
						<li
							key={category._id}
							className='flex justify-between items-center bg-white p-4 border rounded shadow-sm'>
							<span>{category.name}</span>
							<div className='space-x-2'>
								<button
									onClick={() => handleStartEdit(category)}
									className='px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600'>
									Edit
								</button>
								<button
									onClick={() => handleDeleteCategory(category._id)}
									className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'>
									Delete
								</button>
							</div>
						</li>
					))
				) : (
					<p className='text-gray-600'>No categories available.</p>
				)}
			</ul>
		</div>
	);
};

export default CategoryManagement;
