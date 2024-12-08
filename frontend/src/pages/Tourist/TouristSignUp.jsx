/** @format */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { touristSignup } from '../../api';

const TouristSignUp = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		mobileNumber: '',
		nationality: '',
		dob: '',
		occupation: '',
	});

	const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatusMessage({ type: '', text: '' });

		try {
			await touristSignup(formData);
			setStatusMessage({
				type: 'success',
				text: 'Signup successful! Redirecting to login...',
			});

			setTimeout(() => {
				navigate('/tourist-Login');
			}, 2000);
		} catch (error) {
			setStatusMessage({
				type: 'error',
				text:
					error.response?.data?.message || 'Signup failed. Please try again.',
			});
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 '>
			<div className='max-w-md w-full bg-white p-8 shadow-2xl rounded-lg border-t-8 border-indigo-600'>
				<h2 className='text-4xl font-bold text-center text-gray-800 mb-6'>
					Tourist Sign Up
				</h2>
				<p className='text-center text-gray-600 mb-6'>
					Create a new account to explore as a tourist.
				</p>

				{/* Status Message */}
				{statusMessage.text && (
					<div
						className={`mb-4 p-4 rounded-lg ${
							statusMessage.type === 'success'
								? 'bg-green-100 border border-green-400 text-green-700'
								: 'bg-red-100 border border-red-400 text-red-700'
						}`}>
						{statusMessage.text}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-6'>
					<div className='flex flex-col'>
						<label
							htmlFor='username'
							className='text-sm font-medium text-gray-700 mb-2'>
							Username
						</label>
						<input
							placeholder='Username'
							type='text'
							name='username'
							onChange={handleChange}
							required
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-500'
						/>
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='email'
							className='text-sm font-medium text-gray-700 mb-2'>
							Email
						</label>
						<input
							placeholder='Email'
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							required
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-500'
						/>
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='password'
							className='text-sm font-medium text-gray-700 mb-2'>
							Password
						</label>
						<input
							placeholder='Password'
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							required
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-500'
						/>
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='mobileNumber'
							className='text-sm font-medium text-gray-700 mb-2'>
							Mobile Number
						</label>
						<input
							placeholder='Mobile Number'
							type='tel'
							name='mobileNumber'
							value={formData.mobileNumber}
							onChange={handleChange}
							required
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-500'
						/>
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='dob'
							className='text-sm font-medium text-gray-700 mb-2'>
							Date of Birth
						</label>
						<input
							placeholder='Date of Birth'
							type='date'
							name='dob'
							value={formData.dob}
							onChange={handleChange}
							required
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700'
						/>
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='nationality'
							className='text-sm font-medium text-gray-700 mb-2'>
							Nationality
						</label>
						<input
							placeholder='Nationality'
							type='text'
							name='nationality'
							value={formData.nationality}
							onChange={handleChange}
							required
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-500'
						/>
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='occupation'
							className='text-sm font-medium text-gray-700 mb-2'>
							Occupation
						</label>
						<input
							placeholder='Occupation'
							type='text'
							name='occupation'
							value={formData.occupation}
							onChange={handleChange}
							required
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-500'
						/>
					</div>
					<button
						type='submit'
						className='w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
						Sign Up
					</button>
				</form>

				{/* Already have an account? */}
				<div className='mt-6 text-center space-y-4'>
					<Link
						to='/tourist-Login'
						className='text-indigo-600 hover:text-indigo-800 transition duration-200'>
						Already have an account as a tourist?{' '}
						<span className='font-semibold'>Login</span>
					</Link>

					<Link
						to='/'
						className='text-indigo-600 hover:text-indigo-800 transition duration-200'>
						Home Page
					</Link>
				</div>
			</div>
		</div>
	);
};

export default TouristSignUp;
