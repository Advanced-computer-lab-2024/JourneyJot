/** @format */

import { useState } from 'react';
import { login } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await login(formData);
			const { token, role } = response.data; // Extract the token and role from the response
			console.log('Received token:', token);
			console.log('User role:', role);

			// Save the token in localStorage
			localStorage.setItem('token', token);
			console.log(
				'Token stored in localStorage:',
				localStorage.getItem('token')
			);
			console.log(role);

			// Navigate based on user role
			if (role === 'admin') {
				navigate('/admins');
			} else if (role === 'tour_guide') {
				navigate('/tour-guide-dashboard'); // Replace with the actual path for the tour guide dashboard
			} else if (role === 'advertiser') {
				navigate('/advertiser-dashboard');
			} else if (role === 'governor') {
				navigate('/tourism-governor');
			} else if (role === 'seller') {
				navigate('/seller-dashboard'); // Replace with the actual path for the advertiser dashboard
			} else {
				console.error('Unknown role:', role);
			}
		} catch (error) {
			console.error('Login failed:', error.response.data);
		}
	};

	return (
		<div className='max-w-md mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg'>
			<h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
				Login
			</h2>
			<form
				onSubmit={handleSubmit}
				className='space-y-6'>
				<div>
					<input
						type='text'
						name='username'
						value={formData.username}
						onChange={handleChange}
						required
						placeholder='Username'
						className='w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50'
					/>
				</div>
				<div>
					<input
						type='password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						required
						placeholder='Password'
						className='w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50'
					/>
				</div>
				<button
					type='submit'
					className='w-full bg-teal-500 text-white py-2 rounded-md shadow-md hover:bg-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500'>
					Login
				</button>
			</form>
			{/* Don't have an account? Sign Up Link */}
			<div className='mt-4 text-center'>
				<Link to='/signup'>
					<h1 className='underline text-teal-500 hover:text-teal-600 transition-all duration-200'>
						Don't have an account? Sign Up
					</h1>
				</Link>
			</div>
		</div>
	);
};

export default LoginPage;
