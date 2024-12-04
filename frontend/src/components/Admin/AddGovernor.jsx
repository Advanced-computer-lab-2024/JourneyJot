/** @format */

import { useState } from 'react';
import axios from 'axios';

const AddGovernor = () => {
	const [newGovernor, setNewGovernor] = useState({
		username: '',
		password: '',
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
			setError('You are not authenticated. Please log in.');
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
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='p-8'>
				<h2 className='text-2xl mb-4 font-bold'>Governor Management</h2>

				{/* Display success and error messages */}
				{success && (
					<div className='bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4'>
						{success}
					</div>
				)}
				{error && (
					<div className='bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4'>
						{error}
					</div>
				)}

				{/* Button to toggle form visibility */}
				<button
					className='bg-blue-500 text-white py-2 px-4 rounded mb-4'
					onClick={() => setIsCreating(!isCreating)}>
					{isCreating ? 'Cancel' : 'Create New Governor'}
				</button>

				{/* Form to create a governor */}
				{isCreating && (
					<form
						onSubmit={handleSubmit}
						className='space-y-4'>
						<div>
							<label className='block font-semibold mb-1'>Username</label>
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
						<div>
							<label className='block font-semibold mb-1'>Password</label>
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
						<div>
							<label className='block font-semibold mb-1'>Role</label>
							<input
								type='text'
								name='role'
								value={newGovernor.role}
								className='w-full p-2 border border-gray-300 rounded'
								disabled
							/>
						</div>
						<button
							type='submit'
							className='bg-green-500 text-white py-2 px-4 rounded'>
							Add Governor
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default AddGovernor;
