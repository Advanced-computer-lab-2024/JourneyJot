/** @format */

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SendEmailToAdvertiser = () => {
	const [advertiserUsername, setAdvertiserUsername] = useState('');
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response = await axios.post(
				'http://localhost:3000/admins/send-email-advertiser',
				{
					advertiserUsername,
					subject,
					message,
				}
			);
			setSuccess('Email sent successfully!');
			setLoading(false);
		} catch (err) {
			setLoading(false);
			setError(err.response ? err.response.data : 'An error occurred');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
				<button
					onClick={() => navigate(-1)}
					className='text-gray-700 text-xl mb-4 flex items-center hover:text-gray-900 transition'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6 mr-2'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15 19l-7-7 7-7'
						/>
					</svg>
					Back
				</button>
				<h2 className='text-2xl font-bold mb-4'>Send Email to Advertiser</h2>

				<form onSubmit={handleSubmit}>
					{/* Advertiser Username */}
					<div className='mb-4'>
						<label
							htmlFor='advertiserUsername'
							className='block text-sm font-medium text-gray-700'>
							Advertiser Username
						</label>
						<input
							id='advertiserUsername'
							type='text'
							value={advertiserUsername}
							onChange={(e) => setAdvertiserUsername(e.target.value)}
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500'
							required
						/>
					</div>

					{/* Subject */}
					<div className='mb-4'>
						<label
							htmlFor='subject'
							className='block text-sm font-medium text-gray-700'>
							Subject
						</label>
						<input
							id='subject'
							type='text'
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500'
							required
						/>
					</div>

					{/* Message */}
					<div className='mb-4'>
						<label
							htmlFor='message'
							className='block text-sm font-medium text-gray-700'>
							Message
						</label>
						<textarea
							id='message'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500'
							rows='5'
							required
						/>
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className='w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50'
						disabled={loading}>
						{loading ? 'Sending...' : 'Send Email'}
					</button>

					{/* Success and Error Messages */}
					{success && <div className='mt-4 text-green-500'>{success}</div>}
					{error && <div className='mt-4 text-red-500'>{error}</div>}
				</form>
			</div>
		</div>
	);
};

export default SendEmailToAdvertiser;
