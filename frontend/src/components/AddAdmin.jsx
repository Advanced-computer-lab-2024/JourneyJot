/** @format */
import { useState } from 'react';
import axios from 'axios';

const AddAdmin = () => {
	const [newAdmin, setNewAdmin] = useState({
		username: '',
		password: '',
		email: '', // New email field
		role: 'admin',
	});
	const [isCreating, setIsCreating] = useState(false);

	// Handle input changes for the new admin form
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewAdmin((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// Submit new admin to the backend
	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
		try {
			const response = await axios.post(
				'http://localhost:3000/admins/addAdmin',
				newAdmin,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setIsCreating(false);
			console.log(response);
			alert('Admin created successfully!');

			// Reset the form
			setNewAdmin({ username: '', password: '', email: '', role: 'admin' });
		} catch (error) {
			console.error('Failed to create admin:', error);
			alert('Failed to create admin');
		}
	};

	return (
		<div className='p-8'>
			<h2 className='text-2xl mb-4'>Admin Management</h2>

			<button
				className='bg-blue-500 text-white p-2 rounded mb-4'
				onClick={() => setIsCreating(!isCreating)}>
				{isCreating ? 'Cancel' : 'Create New Admin'}
			</button>

			{isCreating && (
				<form
					onSubmit={handleSubmit}
					className='mb-6'>
					<div className='mb-4'>
						<label>Username</label>
						<input
							type='text'
							name='username'
							value={newAdmin.username}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter admin username'
							required
						/>
					</div>
					<div className='mb-4'>
						<label>Email</label>
						<input
							type='email'
							name='email'
							value={newAdmin.email}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter admin email'
							required
						/>
					</div>
					<div className='mb-4'>
						<label>Password</label>
						<input
							type='password'
							name='password'
							value={newAdmin.password}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter admin password'
							required
						/>
					</div>
					<div className='mb-4'>
						<label>Role</label>
						<input
							type='text'
							name='role'
							value={newAdmin.role}
							onChange={handleInputChange}
							className='w-full p-2 border border-gray-300 rounded'
							placeholder='Enter admin role'
							disabled
						/>
					</div>
					<button
						type='submit'
						className='bg-green-500 text-white p-2 rounded'>
						Add Admin
					</button>
				</form>
			)}
		</div>
	);
};

export default AddAdmin;
