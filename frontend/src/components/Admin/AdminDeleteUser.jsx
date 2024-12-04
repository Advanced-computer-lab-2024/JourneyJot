/** @format */
import { useState } from 'react';
import axios from 'axios';

const AdminDeleteUser = () => {
	const [username, setUsername] = useState('');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');

	// Handle input change for username
	const handleInputChange = (e) => {
		setUsername(e.target.value);
	};

	// Handle delete user account submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Reset error and success states
		setSuccess('');
		setError('');

		const token = localStorage.getItem('token');
		if (!token) {
			setError('You are not authenticated. Please log in.');
			return;
		}

		try {
			await axios.delete(
				`http://localhost:3000/admins/delete-account/${username}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setSuccess('User deleted successfully!');
			setUsername(''); // Clear input
		} catch (error) {
			console.error(
				'Failed to delete user:',
				error.response ? error.response.data : error.message
			);
			setError(
				`Failed to delete user. ${
					error.response ? error.response.data.message : error.message
				}`
			);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='p-8 max-w-lg w-full'>
				<h2 className='text-2xl font-semibold mb-6 text-center'>Delete User</h2>

				{/* Success Message */}
				{success && (
					<div className='bg-green-100 border border-green-300 text-green-700 p-3 rounded-md mb-4'>
						{success}
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className='bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-4'>
						{error}
					</div>
				)}

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className='bg-white p-6 rounded shadow-md'>
					<div className='mb-4'>
						<label className='block text-gray-700 font-medium mb-2'>
							Username
						</label>
						<input
							type='text'
							value={username}
							onChange={handleInputChange}
							className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
							placeholder='Enter username to delete'
							required
							pattern='^[a-zA-Z0-9_]{3,15}$'
							title='Username must be between 3 and 15 characters and can include letters, numbers, and underscores'
						/>
					</div>
					<button
						type='submit'
						className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full'>
						Delete User
					</button>
				</form>
			</div>
		</div>
	);
};

export default AdminDeleteUser;
