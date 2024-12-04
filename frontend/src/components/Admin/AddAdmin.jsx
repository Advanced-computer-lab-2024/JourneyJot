/** @format */
import { useState } from 'react';
import axios from 'axios';

const AddAdmin = () => {
	const [newAdmin, setNewAdmin] = useState({
		username: '',
		password: '',
		role: 'admin',
	});
	const [isCreating, setIsCreating] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// Handle input changes for the new admin form
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewAdmin((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// Submit new admin to the backend
	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');

		if (!token) {
			setErrorMessage('User is not authenticated. Please log in.');
			return;
		}

		try {
			const response = await axios.post(
				'http://localhost:3000/admins/addAdmin',
				newAdmin,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setSuccessMessage('Admin created successfully!');
			setErrorMessage(''); // Clear any previous error
			setNewAdmin({ username: '', password: '', role: 'admin' });
			setIsCreating(false); // Close the form
		} catch (error) {
			console.error('Failed to create admin:', error.response || error.message);
			setErrorMessage(
				error.response?.data?.message ||
					'An error occurred while creating the admin.'
			);
			setSuccessMessage(''); // Clear any previous success message
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
				<h2 className='text-3xl font-semibold mb-6 text-center text-teal-700'>
					Admin Management
				</h2>

				{/* Toggle Create Admin Form */}
				<button
					className='w-full bg-blue-500 text-white py-2 rounded-lg mb-6 transition-transform transform hover:scale-105'
					onClick={() => setIsCreating(!isCreating)}>
					{isCreating ? 'Cancel' : 'Create New Admin'}
				</button>

				{/* Display Success or Error Messages */}
				{errorMessage && (
					<div className='mb-4 text-red-600 bg-red-100 p-3 rounded-lg'>
						{errorMessage}
					</div>
				)}
				{successMessage && (
					<div className='mb-4 text-green-600 bg-green-100 p-3 rounded-lg'>
						{successMessage}
					</div>
				)}

				{/* Create Admin Form */}
				{isCreating && (
					<form
						onSubmit={handleSubmit}
						className='space-y-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Username
							</label>
							<input
								type='text'
								name='username'
								value={newAdmin.username}
								onChange={handleInputChange}
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
								placeholder='Enter admin username'
								required
							/>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Password
							</label>
							<input
								type='password'
								name='password'
								value={newAdmin.password}
								onChange={handleInputChange}
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
								placeholder='Enter admin password'
								required
							/>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Role
							</label>
							<input
								type='text'
								name='role'
								value={newAdmin.role}
								onChange={handleInputChange}
								className='w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500'
								disabled
							/>
						</div>

						<button
							type='submit'
							className='w-full bg-green-500 text-white py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'>
							Add Admin
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default AddAdmin;
