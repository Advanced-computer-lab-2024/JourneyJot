/** @format */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestOTP = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	// Retrieve the JWT token from localStorage (or wherever it's stored)
	const token = localStorage.getItem('token'); // Adjust this if token is stored elsewhere

	const handleRequestOtp = async (e) => {
		e.preventDefault();

		try {
			// Send the JWT token in the Authorization header
			const response = await axios.post(
				'http://localhost:3000/forget/request-otp',
				{ email },
				{
					headers: {
						Authorization: `Bearer ${token}`, // Send token in the request headers
					},
				}
			);
			setMessage(response.data.message);
			setError('');
			// After requesting OTP, navigate to the Verify OTP page
			navigate('/verify-otp', { state: { email } });
		} catch (err) {
			setError(err.response?.data?.error || 'An error occurred');
			setMessage('');
		}
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100'>
			<div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-md'>
				<h2 className='text-2xl font-bold text-center text-gray-800 mb-4'>
					Forgot Password
				</h2>
				<form
					onSubmit={handleRequestOtp}
					className='space-y-4'>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							Email
						</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder='Enter your email'
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						/>
					</div>
					<button
						type='submit'
						className='w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
						Request OTP
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

export default RequestOTP;
