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
		idFile: null, // For ID file upload
		additionalFiles: [], // For additional role-specific files
	});

	const handleChange = (e) => {
		const { name, value, files } = e.target;

		if (name === 'idFile') {
			setFormData({ ...formData, idFile: files[0] });
		} else if (name === 'additionalFiles') {
			setFormData({ ...formData, additionalFiles: files });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
		data.append('username', formData.username);
		data.append('email', formData.email);
		data.append('password', formData.password);
		data.append('role', formData.role);
		data.append('idFile', formData.idFile);

		Array.from(formData.additionalFiles).forEach((file) => {
			data.append('additionalFiles', file);
		});

		try {
			const response = await signup(data);
			console.log('Signup successful', response.data);
			navigate('/login');
		} catch (error) {
			console.error('Signup failed', error.response.data);
		}
	};

	return (
		<div className='max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg'>
			<h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
				Sign Up
			</h2>
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
					className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
				/>
				<input
					placeholder='Email'
					type='email'
					name='email'
					value={formData.email}
					onChange={handleChange}
					required
					className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
				/>
				<input
					placeholder='Password'
					type='password'
					name='password'
					value={formData.password}
					onChange={handleChange}
					required
					className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
				/>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						Role
					</label>
					<select
						name='role'
						value={formData.role}
						onChange={handleChange}
						required
						className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white'>
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
						className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm'
					/>
				</div>

				{formData.role && (
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Upload Additional Documents (if required)
						</label>
						<input
							type='file'
							name='additionalFiles'
							onChange={handleChange}
							multiple
							className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm'
						/>
					</div>
				)}

				<button
					type='submit'
					className='w-full bg-teal-500 text-white py-2 rounded-md shadow-md hover:bg-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500'>
					Sign Up
				</button>
				<Link to='/Tourist-Signup'>
					<h1 className='text-center underline text-teal-500 hover:text-teal-600 transition-all duration-200'>
						Sign up as a tourist
					</h1>
				</Link>
			</form>

			<div className='mt-4 text-center'>
				<Link to='/login'>
					<h1 className='underline text-teal-500 hover:text-teal-600 transition-all duration-200'>
						Already have an account? Log In
					</h1>
				</Link>
			</div>
		</div>
	);
};

export default SignupPage;
