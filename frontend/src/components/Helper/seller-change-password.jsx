/** @format */

import { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const handleChangePassword = async (e) => {
		e.preventDefault();

		try {
			// Retrieve the token from localStorage (or any other source where it is stored)
			const token = localStorage.getItem('token');

			// POST request to change password with bearer token
			const response = await axios.post(
				'http://localhost:3000/sellers/changePassword',
				{
					currentPassword,
					newPassword,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setSuccess(response.data.message);
			setError(null);
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Error changing password'
			);
			setSuccess(null);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='max-w-md mx-auto bg-white shadow-md rounded-lg p-6'>
				<h2 className='text-2xl font-bold mb-4'>Change Password</h2>
				<form onSubmit={handleChangePassword}>
					<div className='mb-4'>
						<label className='block text-sm font-medium text-gray-700'>
							Current Password
						</label>
						<input
							type='password'
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							required
							className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-sm font-medium text-gray-700'>
							New Password
						</label>
						<input
							type='password'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
						/>
					</div>
					<button
						type='submit'
						className='w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition'>
						Change Password
					</button>
				</form>
				{error && <p className='mt-4 text-red-500'>{error}</p>}
				{success && <p className='mt-4 text-green-500'>{success}</p>}
			</div>
		</div>
	);
};

export default ChangePassword;
