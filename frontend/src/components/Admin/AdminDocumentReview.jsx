/** @format */

import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDocumentReview = () => {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchPendingUsers = async () => {
			const token = localStorage.getItem('token');

			if (!token) {
				setError('You are not authenticated. Please login.');
				return;
			}

			try {
				const res = await axios.get(
					'http://localhost:3000/admins/pending-users',
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				console.log('Response Data:', res.data); // Log the entire response data

				// Check if the response structure matches what you expect
				if (res.data && Array.isArray(res.data)) {
					setUsers(res.data); // If users are directly in the response
				} else if (res.data && Array.isArray(res.data.users)) {
					setUsers(res.data.users); // If users are nested
				} else {
					setError('Unexpected response format');
				}
			} catch (error) {
				setError('Error fetching pending users');
				console.error('Fetch error:', error);
			}
		};

		fetchPendingUsers();
	}, []);

	// Function to update user status
	const handleStatusUpdate = async (userId, status) => {
		const token = localStorage.getItem('token');
		if (!token) {
			setError('You are not authenticated. Please login.');
			return;
		}

		try {
			const res = await axios.put(
				`http://localhost:3000/admins/update-user-status/${userId}`,
				{ status }, // Send status in the request body
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (res.data && res.data.message) {
				alert(res.data.message);
			}

			// Remove the user from the list after updating their status
			setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
		} catch (error) {
			alert('Failed to update status');
			console.error('Update error:', error);
		}
	};

	return (
		<div className='p-4'>
			<h2 className='text-2xl font-semibold mb-4'>Admin Document Review</h2>
			{error && <p className='text-red-500'>{error}</p>}
			{users.length === 0 ? (
				<p className='text-gray-500'>No pending users at the moment.</p>
			) : (
				users.map((user) => (
					<div
						key={user._id}
						className='border p-4 mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
						<p className='font-semibold'>
							<strong>Username:</strong> {user.username}
						</p>
						<p className='font-semibold'>
							<strong>Role:</strong> {user.role}
						</p>
						<p className='font-semibold'>
							<strong>Status:</strong> {user.registrationStatus}
						</p>
						<p className='font-semibold'>
							<strong>Uploaded ID:</strong>{' '}
							<a
								href={`http://localhost:3000/uploads/${user.idFile}`} // Ensure correct file URL
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-600 hover:underline'>
								View ID Document
							</a>
						</p>
						<p className='font-semibold'>
							<strong>Additional Documents:</strong>
						</p>
						<ul>
							{user.additionalFiles &&
								user.additionalFiles.map((file, idx) => (
									<li key={idx}>
										<a
											href={`http://localhost:3000/uploads/${file}`} // Ensure correct file URL
											target='_blank'
											rel='noopener noreferrer'
											className='text-blue-600 hover:underline'>
											View Additional Document {idx + 1}
										</a>
									</li>
								))}
						</ul>
						<div className='mt-4'>
							<button
								onClick={() => handleStatusUpdate(user._id, 'approved')}
								className='px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors mr-2'>
								Accept
							</button>
							<button
								onClick={() => handleStatusUpdate(user._id, 'rejected')}
								className='px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors'>
								Reject
							</button>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default AdminDocumentReview;
