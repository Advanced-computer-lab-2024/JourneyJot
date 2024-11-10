/** @format */

import { useState } from 'react';
import { login } from '../../api';
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
			const { token, role } = response.data;
			localStorage.setItem('token', token);
			if (role === 'admin') {
				navigate('/admins');
			} else if (role === 'tour_guide') {
				navigate('/tour-guide-dashboard');
			} else if (role === 'advertiser') {
				navigate('/advertiser-dashboard');
			} else if (role === 'governor') {
				navigate('/tourism-governor');
			} else if (role === 'seller') {
				navigate('/seller-dashboard');
			} else {
				console.error('Unknown role:', role);
			}
		} catch (error) {
			console.error('Login failed:', error.response.data);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-blue-500'>
			<div className='max-w-md w-full bg-white p-8 shadow-xl rounded-lg'>
				<h2 className='text-3xl font-semibold text-center text-gray-800 mb-6'>
					Welcome Back
				</h2>
				<p className='text-center text-gray-600 mb-8'>
					Please log in to your account
				</p>
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
							className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50'
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
							className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50'
						/>
					</div>
					<button
						type='submit'
						className='w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'>
						Login
					</button>
				</form>
				<div className='mt-6 text-center text-gray-600'>
					<Link to='/signup'>
						<span className='underline text-blue-500 hover:text-blue-600 transition-all duration-200'>
							Don't have an account? Sign Up
						</span>
					</Link>
				</div>
				<div className='mt-4 text-center text-gray-600'>
					<Link to='/tourist-Login'>
						<span className='underline text-blue-500 hover:text-blue-600 transition-all duration-200'>
							Login as a tourist
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
