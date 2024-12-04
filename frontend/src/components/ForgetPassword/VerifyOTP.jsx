/** @format */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyOtp = () => {
	const [otp, setOtp] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const { state } = useLocation(); // Get the email from the navigate state
	const { email } = state || {};
	const navigate = useNavigate();

	// Retrieve the JWT token from localStorage (or wherever it's stored)
	const token = localStorage.getItem('token'); // Adjust this part if token is stored differently

	const handleVerifyOtp = async (e) => {
		e.preventDefault();

		try {
			// Sending the JWT token in the Authorization header
			const response = await axios.post(
				'http://localhost:3000/forget/verify-otp',
				{ email, otp },
				{
					headers: {
						Authorization: `Bearer ${token}`, // Add the token to the request headers
					},
				}
			);
			setMessage(response.data.message);
			setError('');
			// After successful verification, navigate to Reset Password page
			navigate('/reset-password', { state: { email } });
		} catch (err) {
			setError(err.response?.data?.error || 'Invalid OTP');
			setMessage('');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 flex items-center justify-center'>
			<div className='bg-white shadow-2xl rounded-xl p-8 w-full max-w-md'>
				<h2 className='text-3xl font-extrabold text-center text-gray-900 mb-6'>
					Verify OTP
				</h2>
				<p className='text-sm text-gray-600 text-center mb-6'>
					Enter the OTP sent to{' '}
					<span className='font-semibold text-indigo-600'>{email}</span>.
				</p>
				<form
					onSubmit={handleVerifyOtp}
					className='space-y-5'>
					<div>
						<label
							htmlFor='otp'
							className='block text-sm font-medium text-gray-700'>
							OTP
						</label>
						<input
							type='text'
							id='otp'
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							required
							placeholder='Enter the OTP'
							className='mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
					<button
						type='submit'
						className='w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2'>
						Verify OTP
					</button>
				</form>
				{/* Success message */}
				{message && (
					<div className='mt-6 p-4 text-sm text-green-800 bg-green-100 rounded-lg shadow'>
						{message}
					</div>
				)}
				{/* Error message */}
				{error && (
					<div className='mt-6 p-4 text-sm text-red-800 bg-red-100 rounded-lg shadow'>
						{error}
					</div>
				)}
			</div>
		</div>
	);
};

export default VerifyOtp;
