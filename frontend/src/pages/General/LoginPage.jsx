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
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null); // Reset error before attempting login
		setSuccess(null); // Reset success before attempting login
		try {
			const response = await login(formData);
			const { token, role } = response.data;
			localStorage.setItem('token', token);
			setSuccess('Login successful! Redirecting...');
			setTimeout(() => {
				if (role === 'admin') {
					navigate('/admins');
				} else if (role === 'tour_guide') {
					navigate('/tour-guide-dashboard');
				} else if (role === 'advertiser') {
					navigate('/advertiser-dashboard');
				} else if (role === 'governor') {
					navigate('/Governor');
				} else if (role === 'seller') {
					navigate('/seller-dashboard');
				} else {
					setError('Unknown role detected.');
				}
			}, 1000); // Delay to show success message before navigation
		} catch (error) {
			setError(
				error.response?.data?.message ||
					'Login failed. Please check your credentials.'
			);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500'>
			<div className='max-w-md w-full bg-white p-8 shadow-2xl rounded-lg border-t-8 border-indigo-600'>
				<h2 className='text-4xl font-bold text-center text-gray-800 mb-6'>
					Welcome Back
				</h2>
				<p className='text-center text-gray-600 mb-6'>
					Please log in to your account
				</p>
				{/* Error Message */}
				{error && (
					<div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
						{error}
					</div>
				)}
				{/* Success Message */}
				{success && (
					<div className='mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg'>
						{success}
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
							type='text'
							name='username'
							value={formData.username}
							onChange={handleChange}
							required
							placeholder='Username'
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
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							required
							placeholder='Password'
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-500'
						/>
					</div>
					<button
						type='submit'
						className='w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
						Login
					</button>
				</form>
				<div className='mt-6 text-center'>
					<Link to='/signup'>
						<span className='text-indigo-600 hover:text-indigo-800 transition-all duration-200'>
							Don't have an account?{' '}
							<span className='font-semibold'>Sign Up</span>
						</span>
					</Link>
				</div>
				<div className='mt-4 text-center'>
					<Link to='/tourist-Login'>
						<span className='text-indigo-600 hover:text-indigo-800 transition-all duration-200'>
							Login as a tourist
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
