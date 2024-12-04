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
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500'>
			<div className='max-w-lg w-full bg-white p-8 shadow-xl rounded-lg'>
				<h2 className='text-3xl font-semibold text-center text-gray-800 mb-6'>
					Tourist Sign Up
				</h2>

				{statusMessage.text && (
					<div
						className={`p-4 mb-4 rounded-lg ${
							statusMessage.type === 'success'
								? 'bg-green-100 text-green-700'
								: 'bg-red-100 text-red-700'
						}`}>
						{statusMessage.text}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-6'>
					<input
						placeholder='Username'
						type='text'
						name='username'
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50'
					/>
					<input
						placeholder='Email'
						type='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50'
					/>
					<input
						placeholder='Password'
						type='password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50'
					/>
					<input
						placeholder='Mobile Number'
						type='tel'
						name='mobileNumber'
						value={formData.mobileNumber}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50'
					/>
					<input
						placeholder='Date of Birth'
						type='date'
						name='dob'
						value={formData.dob}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white'
					/>
					<input
						placeholder='Nationality'
						type='text'
						name='nationality'
						value={formData.nationality}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50'
					/>
					<input
						placeholder='Occupation'
						type='text'
						name='occupation'
						value={formData.occupation}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50'
					/>
					<button
						type='submit'
						className='w-full bg-teal-500 text-white py-2 rounded-lg shadow-md hover:bg-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500'>
						Sign Up
					</button>
					<Link to='/signup'>
						<h1 className='text-center underline text-teal-500 hover:text-teal-600 transition-all duration-200'>
							Sign Up as another role
						</h1>
					</Link>
				</form>

				{/* Already have an account? Login Link */}
				<div className='mt-4 text-center'>
					<Link to='/tourist-Login'>
						<h1 className='underline text-teal-500 hover:text-teal-600 transition-all duration-200'>
							Already have an account as a tourist? Login
						</h1>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default TouristSignUp;
