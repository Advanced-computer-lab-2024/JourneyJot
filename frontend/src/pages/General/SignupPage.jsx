/** @format */

import { useState } from 'react';
import { signup } from '../../api';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		role: '',
		idFile: null,
		additionalFiles: [],
		acceptedTerms: false,
	});

	const [errorMessage, setErrorMessage] = useState(''); // For error messages
	const [successMessage, setSuccessMessage] = useState(''); // For success messages

	const handleChange = (e) => {
		const { name, value, files, type, checked } = e.target;
		if (name === 'idFile') {
			setFormData({ ...formData, idFile: files[0] });
		} else if (name === 'additionalFiles') {
			setFormData({ ...formData, additionalFiles: files });
		} else if (type === 'checkbox') {
			setFormData({ ...formData, [name]: checked });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Reset messages on every submit attempt
		setErrorMessage('');
		setSuccessMessage('');

		if (!formData.acceptedTerms) {
			setErrorMessage('You must accept the terms and conditions to sign up.');
			return;
		}

		const data = new FormData();
		data.append('username', formData.username);
		data.append('email', formData.email);
		data.append('password', formData.password);
		data.append('role', formData.role);
		data.append('idFile', formData.idFile);
		data.append('acceptedTerms', formData.acceptedTerms);

		Array.from(formData.additionalFiles).forEach((file) => {
			data.append('additionalFiles', file);
		});

		try {
			const response = await signup(data);
			setSuccessMessage('Signup successful! Redirecting to login...');
			setTimeout(() => {
				navigate('/login');
			}, 2000); // Redirect after 2 seconds
		} catch (error) {
			setErrorMessage('Signup failed. Please try again.');
			console.error('Signup failed', error.response?.data || error);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500'>
			<div className='max-w-lg w-full bg-white p-8 shadow-xl rounded-lg'>
				<h2 className='text-3xl font-semibold text-center text-gray-800 mb-6'>
					Create an Account
				</h2>
				<p className='text-center text-gray-600 mb-8'>
					Join us today for an amazing experience!
				</p>

				{errorMessage && (
					<div className='text-red-600 text-center mb-4 p-2 bg-red-100 rounded-lg'>
						{errorMessage}
					</div>
				)}

				{successMessage && (
					<div className='text-green-600 text-center mb-4 p-2 bg-green-100 rounded-lg'>
						{successMessage}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-6'
					encType='multipart/form-data'>
					<input
						placeholder='Username'
						type='text'
						name='username'
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50'
					/>
					<input
						placeholder='Email'
						type='email'
						name='email'
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50'
					/>
					<input
						placeholder='Password'
						type='password'
						name='password'
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50'
					/>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Role
						</label>
						<select
							name='role'
							onChange={handleChange}
							required
							className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'>
							<option value=''>Select Role</option>
							<option value='seller'>Seller</option>
							<option value='tour_guide'>Tour Guide</option>
							<option value='advertiser'>Advertiser</option>
						</select>
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Upload ID Document
						</label>
						<input
							type='file'
							name='idFile'
							onChange={handleChange}
							required
							className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm'
						/>
					</div>

					{formData.role && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Upload Additional Documents
							</label>
							<input
								type='file'
								name='additionalFiles'
								onChange={handleChange}
								multiple
								className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm'
							/>
						</div>
					)}

					<label className='flex items-center'>
						<input
							type='checkbox'
							name='acceptedTerms'
							checked={formData.acceptedTerms}
							onChange={handleChange}
							className='mr-2'
						/>
						<span className='text-gray-700'>
							I accept the{' '}
							<Link
								to='/terms'
								className='text-blue-500 underline'>
								terms and conditions
							</Link>
						</span>
					</label>

					<button
						type='submit'
						className='w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'>
						Sign Up
					</button>
				</form>

				<div className='mt-6 text-center text-gray-600'>
					<Link to='/Tourist-Signup'>
						<span className='underline text-blue-500 hover:text-blue-600 transition-all duration-200'>
							Sign up as a tourist
						</span>
					</Link>
				</div>
				<div className='mt-4 text-center text-gray-600'>
					<Link to='/login'>
						<span className='underline text-blue-500 hover:text-blue-600 transition-all duration-200'>
							Already have an account? Log In
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;
