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
		<div className='p-8'>
			<h2 className='text-2xl mb-4'>Admin Management</h2>

			{/* Toggle Create Admin Form */}
			<button
				className='bg-blue-500 text-white p-2 rounded mb-4'
				onClick={() => setIsCreating(!isCreating)}>
				{isCreating ? 'Cancel' : 'Create New Admin'}
			</button>

			{/* Display Success or Error Messages */}
			{errorMessage && (
				<div className='mb-4 text-red-600 bg-red-100 p-2 rounded'>
					{errorMessage}
				</div>
			)}
			{successMessage && (
				<div className='mb-4 text-green-600 bg-green-100 p-2 rounded'>
					{successMessage}
				</div>
			)}

			{/* Create Admin Form */}
			{isCreating && (
				<form
					onSubmit={handleSubmit}
					className='mb-6'>
					<div className='mb-4'>
						<label>Username</label>
						<input
							type='text'
							name='username'
							value={newAdmin.username}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter admin username'
							required
						/>
					</div>
					<div className='mb-4'>
						<label>Password</label>
						<input
							type='password'
							name='password'
							value={newAdmin.password}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter admin password'
							required
						/>
					</div>
					<div className='mb-4'>
						<label>Role</label>
						<input
							type='text'
							name='role'
							value={newAdmin.role}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							disabled
						/>
					</div>
					<button
						type='submit'
						className='bg-green-500 text-white p-2 rounded'>
						Add Admin
					</button>
				</form>
			)}
		</div>
	);
};

export default AddAdmin;
