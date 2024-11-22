/** @format */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
	const [newPassword, setNewPassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const { state } = useLocation(); // Get the email from the navigate state
	const { email } = state || {};

	// Retrieve the JWT token from localStorage (or wherever it is stored)
	const token = localStorage.getItem('token'); // Assuming it's saved in localStorage

	const handleResetPassword = async (e) => {
		e.preventDefault();

		try {
			// Sending the JWT token in the Authorization header
			const response = await axios.post(
				'http://localhost:3000/forget/reset-password',
				{
					email,
					newPassword,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Add the token to the request headers
					},
				}
			);
			setMessage('Your password has been reset successfully!');
			setError('');
		} catch (err) {
			setError(
				err.response?.data?.error || 'An error occurred. Please try again.'
			);
			setMessage('');
		}
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100'>
			<div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-md'>
				<h2 className='text-2xl font-bold text-center text-gray-800 mb-4'>
					Reset Password
				</h2>
				<p className='text-center text-gray-600 mb-4'>
					Enter a new password for your account associated with{' '}
					<span className='font-semibold'>{email}</span>.
				</p>
				<form
					onSubmit={handleResetPassword}
					className='space-y-4'>
					<div>
						<label
							htmlFor='newPassword'
							className='block text-sm font-medium text-gray-700'>
							New Password
						</label>
						<input
							type='password'
							id='newPassword'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							placeholder='Enter your new password'
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						/>
					</div>
					<button
						type='submit'
						className='w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
						Reset Password
					</button>
				</form>
				{/* Success message */}
				{message && (
					<p className='mt-4 text-green-600 text-center font-semibold'>
						{message}
					</p>
				)}
				{/* Error message */}
				{error && (
					<p className='mt-4 text-red-600 text-center font-semibold'>{error}</p>
				)}
			</div>
		</div>
	);
};

export default ResetPassword;
