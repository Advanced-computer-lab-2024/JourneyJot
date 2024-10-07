/** @format */

import { useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { signup } from '../api';

const SignupPage = () => {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		role: '', // Add role field
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await signup(formData);
			console.log('Signup successful', response.data);
		} catch (error) {
			console.error('Signup failed', error.response.data);
		}
	};

	return (
		<div className='container'>
			<h2>Sign Up</h2>
			<form onSubmit={handleSubmit}>
				<FormInput
					label='Username'
					type='text'
					name='username'
					// value={formData.username}
					onChange={handleChange}
					required
				/>
				<FormInput
					label='Email'
					type='email'
					name='email'
					value={formData.email}
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
				<div className='form-group'>
					<label>Role</label>
					<select
						name='role'
						value={formData.role}
						onChange={handleChange}
						required
						className='form-input'>
						<option value=''>Select Role</option>
						<option value='admin'>Admin</option>
						<option value='seller'>Seller</option>
						<option value='tour_guide'>TourGuide</option>
						<option value='advertiser'>advertiser</option>
					</select>
				</div>
				<Button
					label='Sign Up'
					className='btn-primary'
				/>
			</form>
		</div>
	);
};

export default SignupPage;
