/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManagement = () => {
	const [categories, setCategories] = useState([]);
	const [newCategory, setNewCategory] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editCategoryId, setEditCategoryId] = useState(null);

	// Fetch categories on component mount
	useEffect(() => {
		const fetchCategories = async () => {
			const token = localStorage.getItem('token');
			try {
				const response = await axios.get('http://localhost:3000/categories', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setCategories(response.data);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};

		fetchCategories();
	}, []);

	// Handle input change for the category
	const handleInputChange = (e) => {
		setNewCategory(e.target.value);
	};

	// Add a new category
	const handleAddCategory = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
		try {
			const response = await axios.post(
				'http://localhost:3000/categories',
				{ name: newCategory },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setCategories((prev) => [...prev, response.data.category]);
			setNewCategory('');
		} catch (error) {
			console.error('Failed to add category:', error);
		}
	};

	// Edit an existing category
	const handleEditCategory = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
		try {
			const response = await axios.put(
				`http://localhost:3000/categories/${editCategoryId}`,
				{ name: newCategory },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setCategories((prev) =>
				prev.map((category) =>
					category._id === editCategoryId ? response.data.category : category
				)
			);
			setNewCategory('');
			setIsEditing(false);
			setEditCategoryId(null);
		} catch (error) {
			console.error('Failed to edit category:', error);
		}
	};

	// Start editing a category
	const handleStartEdit = (category) => {
		setNewCategory(category.name);
		setIsEditing(true);
		setEditCategoryId(category._id);
	};

	// Delete a category
	const handleDeleteCategory = async (id) => {
		const token = localStorage.getItem('token');
		try {
			await axios.delete(`http://localhost:3000/categories/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setCategories((prev) => prev.filter((category) => category._id !== id));
		} catch (error) {
			console.error('Failed to delete category:', error);
		}
	};

	return (
		<div className='p-8'>
			<h2 className='text-2xl mb-4'>Category Management</h2>

			<form
				onSubmit={isEditing ? handleEditCategory : handleAddCategory}
				className='mb-6'>
				<div className='mb-4'>
					<label>Category Name</label>
					<input
						type='text'
						value={newCategory}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded'
						placeholder='Enter category name'
						required
					/>
				</div>
				<button
					type='submit'
					className='bg-green-500 text-white p-2 rounded'>
					{isEditing ? 'Update Category' : 'Add Category'}
				</button>
			</form>

			<h3 className='text-xl mb-4'>Current Categories</h3>
			{categories.length > 0 ? (
				<ul className='list-disc pl-5'>
					{categories.map((category) => (
						<li
							key={category._id}
							className='mb-2 flex justify-between'>
							<span>{category.name}</span>
							<div>
								<button
									className='bg-yellow-500 text-white p-1 rounded mr-2'
									onClick={() => handleStartEdit(category)}>
									Edit
								</button>
								<button
									className='bg-red-500 text-white p-1 rounded'
									onClick={() => handleDeleteCategory(category._id)}>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p>No categories available.</p>
			)}
		</div>
	);
};

export default CategoryManagement;
