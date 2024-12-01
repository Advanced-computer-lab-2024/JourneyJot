/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
	const [users, setUsers] = useState([]);
	const [tourists, setTourists] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const API_URL = 'http://localhost:3000/admins/users-and-tourists'; // Replace with your API URL

	// Get the token from localStorage
	const token = localStorage.getItem('token');

	// Fetch users and tourists data
	const fetchUsersAndTourists = async () => {
		if (!token) {
			setError('No token found. Please log in.');
			return;
		}

		setLoading(true);
		try {
			const response = await axios.get(API_URL, {
				headers: {
					Authorization: `Bearer ${token}`, // Include the token in the Authorization header
				},
			});
			setUsers(response.data.users);
			setTourists(response.data.tourists);
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Error fetching data'
			);
		} finally {
			setLoading(false);
		}
	};

	// Fetch data when the component mounts
	useEffect(() => {
		fetchUsersAndTourists();
	}, []);

	return (
		<div className='min-h-screen bg-gray-100 p-6'>
			<div className='bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto'>
				<h1 className='text-3xl font-semibold text-gray-900 mb-6 text-center'>
					Users and Tourists Data
				</h1>

				{loading ? (
					<p className='text-center text-blue-500 text-xl'>Loading...</p>
				) : error ? (
					<p className='text-center text-red-500 text-xl'>{error}</p>
				) : (
					<>
						{/* Users Section */}
						<div className='mb-8'>
							<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
								Users
							</h2>
							<ul className='space-y-4'>
								{users.map((user) => (
									<li
										key={user._id}
										className='p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100'>
										<div className='flex justify-between'>
											<p className='text-lg font-medium text-gray-800'>
												{user.name} - {user.username}
											</p>
											<span className='text-sm font-semibold text-blue-600'>
												{user.role}
											</span>
										</div>
									</li>
								))}
							</ul>
						</div>

						{/* Tourists Section */}
						<div className='mb-8'>
							<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
								Tourists
							</h2>
							<ul className='space-y-4'>
								{tourists.map((tourist) => (
									<li
										key={tourist._id}
										className='p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100'>
										<div className='flex justify-between'>
											<p className='text-lg font-medium text-gray-800'>
												{tourist.name} - {tourist.username}
											</p>
										</div>
									</li>
								))}
							</ul>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default UserList;
