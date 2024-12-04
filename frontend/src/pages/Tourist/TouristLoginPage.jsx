/** @format */

import { useState } from 'react';
import { touristLogin } from '../../api';
import { useNavigate, Link } from 'react-router-dom';

const TouristLoginPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const [errorMessage, setErrorMessage] = useState(''); // For displaying login errors

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(''); // Reset error message
		try {
			const response = await touristLogin(formData);
			const token = response.data.token;
			localStorage.setItem('token', token);
			console.log('Login successful', response.data);
			navigate('/tourist/homePage');
		} catch (error) {
			const errorMsg =
				error.response?.data?.message ||
				'Something went wrong. Please try again.';
			setErrorMessage(errorMsg);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500'>
			<div className='max-w-lg w-full bg-white p-8 shadow-xl rounded-lg'>
				<h2 className='text-3xl font-semibold text-center text-gray-800 mb-6'>
					Tourist Login
				</h2>

				{/* Error Message */}
				{errorMessage && (
					<div className='bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-center'>
						{errorMessage}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-6'>
					{/* Username Field */}
					<div>
						<input
							type='text'
							name='username'
							value={formData.username}
							onChange={handleChange}
							required
							placeholder='Username'
							className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50'
						/>
					</div>

					{/* Password Field */}
					<div>
						<input
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							required
							placeholder='Password'
							className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50'
						/>
					</div>

					{/* Login Button */}
					<button
						type='submit'
						className='w-full bg-teal-500 text-white py-2 rounded-lg shadow-md hover:bg-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500'>
						Login
					</button>
				</form>

				{/* Redirect to Signup */}
				<div className='mt-4 text-center'>
					<Link to='/tourist-signup'>
						<h1 className='underline text-teal-500 hover:text-teal-600 transition-all duration-200'>
							Don't have an account? Sign Up
						</h1>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default TouristLoginPage;
