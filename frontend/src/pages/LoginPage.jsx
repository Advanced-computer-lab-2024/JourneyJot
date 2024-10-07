/** @format */

import { useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: '', // Updated: Login with username instead of email
		password: '',
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await login(formData);
			console.log('Login successful', response.data);
			navigate('/admins'); // Updated: Redirect to dashboard after successful login
		} catch (error) {
			console.error('Login failed', error.response.data);
		}
	};

	return (
		<div className='container'>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<FormInput
					label='Username' // Updated: Username input
					type='text'
					name='username'
					value={formData.username}
					onChange={handleChange}
					required
				/>
				<FormInput
					label='Password'
					type='password'
					name='password'
					value={formData.password}
					onChange={handleChange}
					required
				/>
				<Button
					label='Login'
					className='btn-primary'
				/>
			</form>
		</div>
	);
};

export default LoginPage;
