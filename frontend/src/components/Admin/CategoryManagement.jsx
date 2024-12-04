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
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='p-8 max-w-2xl mx-auto bg-gray-50 shadow-md rounded-lg'>
				<h2 className='text-2xl font-bold mb-6 text-gray-800'>
					Category Management
				</h2>

				{/* Error and Success Messages */}
				{error && <p className='text-red-600 mb-4'>{error}</p>}
				{success && <p className='text-green-600 mb-4'>{success}</p>}

				{/* Category Form */}
				<form
					onSubmit={handleCategorySubmit}
					className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Category Name
						</label>
						<input
							type='text'
							value={newCategory}
							onChange={handleInputChange}
							className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none'
							placeholder='Enter category name'
							required
						/>
					</div>

					<button
						type='submit'
						className='w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300'>
						{isEditing ? 'Update Category' : 'Add Category'}
					</button>
				</form>

				{/* Category List */}
				<h3 className='text-xl font-bold mt-8 mb-4 text-gray-800'>
					Current Categories
				</h3>
				<ul className='space-y-4'>
					{categories.length > 0 ? (
						categories.map((category) => (
							<li
								key={category._id}
								className='flex justify-between items-center bg-white p-4 border rounded-lg shadow-md hover:shadow-lg transition-all'>
								<span className='text-gray-800'>{category.name}</span>
								<div className='space-x-3'>
									<button
										onClick={() => handleStartEdit(category)}
										className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200'>
										Edit
									</button>
									<button
										onClick={() => handleDeleteCategory(category._id)}
										className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200'>
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
		</div>
	);
};

export default CategoryManagement;
