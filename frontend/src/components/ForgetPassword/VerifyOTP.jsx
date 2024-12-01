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
		<div className='flex justify-center items-center min-h-screen bg-gray-100'>
			<div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-md'>
				<h2 className='text-2xl font-bold text-center text-gray-800 mb-4'>
					Verify OTP
				</h2>
				<p className='text-center text-gray-600 mb-4'>
					Enter the OTP sent to <span className='font-semibold'>{email}</span>.
				</p>
				<form
					onSubmit={handleVerifyOtp}
					className='space-y-4'>
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
							placeholder='Enter your OTP'
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						/>
					</div>
					<button
						type='submit'
						className='w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
						Verify OTP
					</button>
				</form>
				{message && (
					<p className='mt-4 text-green-600 text-center'>{message}</p>
				)}
				{error && <p className='mt-4 text-red-600 text-center'>{error}</p>}
			</div>
		</div>
	);
};

export default VerifyOtp;
