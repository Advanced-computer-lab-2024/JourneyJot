/** @format */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();

	const handleChangePassword = async (e) => {
		e.preventDefault();

		try {
			const token = localStorage.getItem('token');

			const response = await axios.post(
				'http://localhost:3000/tourists/changePassword',
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
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex flex-col items-center justify-start p-4'>
			<div className='min-w-full flex items-start'>
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
			</div>

			{/* Form Container */}
			<div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8 mt-10'>
				<h2 className='text-3xl font-bold text-center text-indigo-700 mb-6'>
					Change Password
				</h2>
				<form onSubmit={handleChangePassword}>
					{/* Current Password */}
					<div className='mb-6'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Current Password
						</label>
						<input
							type='password'
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							required
							className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
						/>
					</div>

					{/* New Password */}
					<div className='mb-6'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							New Password
						</label>
						<input
							type='password'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
						/>
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className='w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition'>
						Change Password
					</button>
				</form>

				{/* Success/Error Message */}
				{error && <p className='mt-4 text-red-500 text-center'>{error}</p>}
				{success && (
					<p className='mt-4 text-green-500 text-center'>{success}</p>
				)}
			</div>
		</div>
	);
};

export default ChangePassword;
