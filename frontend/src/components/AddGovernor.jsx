/** @format */

import { useState } from 'react';
import axios from 'axios';

const AddGovernor = () => {
	const [newGovernor, setNewGovernor] = useState({
		username: '',
		password: '',
		email: '',
		role: 'governor',
	});
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState(''); // To display errors
	const [success, setSuccess] = useState(''); // To display success message

	// Handle input changes for the new governor form
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewGovernor((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// Submit new governor to the backend
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(''); // Clear previous errors
		setSuccess(''); // Clear previous success message

		const token = localStorage.getItem('token');

		if (!token) {
			setError('You are not authenticated. Please login.');
			return;
		}

		try {
			const response = await axios.post(
				'http://localhost:3000/admins/addGovernor',
				newGovernor,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setIsCreating(false);
			setSuccess('Governor created successfully!');
			console.log(response);

			// Reset the form
			setNewGovernor({
				username: '',
				password: '',
				email: '',
				role: 'governor',
			});
		} catch (error) {
			console.error(
				'Failed to create governor:',
				error.response ? error.response.data : error.message
			);
			setError(
				'Failed to create governor. ' +
					(error.response ? error.response.data.message : error.message)
			);
		}
	};

	return (
		<div className='p-8'>
			<h2 className='text-2xl mb-4'>Governor Management</h2>

			{success && (
				<div className='bg-green-100 p-2 rounded text-green-600 mb-4'>
					{success}
				</div>
			)}
			{error && (
				<div className='bg-red-100 p-2 rounded text-red-600 mb-4'>{error}</div>
			)}

			<button
				className='bg-blue-500 text-white p-2 rounded mb-4'
				onClick={() => setIsCreating(!isCreating)}>
				{isCreating ? 'Cancel' : 'Create New Governor'}
			</button>

			{isCreating && (
				<form
					onSubmit={handleSubmit}
					className='mb-6'>
					<div className='mb-4'>
						<label>Username</label>
						<input
							type='text'
							name='username'
							value={newGovernor.username}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter governor username'
							required
						/>
					</div>
					<div className='mb-4'>
						<label>Password</label>
						<input
							type='password'
							name='password'
							value={newGovernor.password}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter governor password'
							required
						/>
					</div>
					<div className='mb-4'>
						<label>Email</label>
						<input
							type='email'
							name='email'
							value={newGovernor.email}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter governor email'
							required
						/>
					</div>
					<div className='mb-4'>
						<label>Role</label>
						<input
							type='text'
							name='role'
							value={newGovernor.role}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter governor role'
							disabled
						/>
					</div>
					<button
						type='submit'
						className='bg-green-500 text-white p-2 rounded'>
						Add Governor
					</button>
				</form>
			)}
		</div>
	);
};

export default AddGovernor;
