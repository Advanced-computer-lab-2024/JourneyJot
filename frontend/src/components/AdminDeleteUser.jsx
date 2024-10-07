/** @format */

import { useState } from 'react';
import axios from 'axios';

const AdminDeleteUser = () => {
	const [userId, setUserId] = useState('');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');

	// Handle input change for user ID
	const handleInputChange = (e) => {
		setUserId(e.target.value);
	};

	// Handle delete user account submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccess(''); // Clear previous success message
		setError(''); // Clear previous error message

		const token = localStorage.getItem('token');

		if (!token) {
			setError('You are not authenticated. Please login.');
			return;
		}

		try {
			const response = await axios.delete(
				`http://localhost:3000/admins/delete-account/${userId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setSuccess('User deleted successfully!');
			console.log(response);

			// Reset the userId input
			setUserId('');
		} catch (error) {
			console.error(
				'Failed to delete user:',
				error.response ? error.response.data : error.message
			);
			setError(
				'Failed to delete user. ' +
					(error.response ? error.response.data.message : error.message)
			);
		}
	};

	return (
		<div className='p-8'>
			<h2 className='text-2xl mb-4'>Delete User</h2>

			{success && (
				<div className='bg-green-100 p-2 rounded text-green-600 mb-4'>
					{success}
				</div>
			)}
			{error && (
				<div className='bg-red-100 p-2 rounded text-red-600 mb-4'>{error}</div>
			)}

			<form
				onSubmit={handleSubmit}
				className='mb-6'>
				<div className='mb-4'>
					<label>User ID</label>
					<input
						type='text'
						value={userId}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded'
						placeholder='Enter user ID to delete'
						required
					/>
				</div>
				<button
					type='submit'
					className='bg-red-500 text-white p-2 rounded'>
					Delete User
				</button>
			</form>
		</div>
	);
};

export default AdminDeleteUser;
