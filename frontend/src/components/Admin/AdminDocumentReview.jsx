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
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='p-6 max-w-3xl w-full'>
				<h2 className='text-2xl font-semibold mb-6 text-center'>
					Admin Document Review
				</h2>

				{/* Error Message */}
				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}

				{/* No Pending Users Message */}
				{users.length === 0 ? (
					<p className='text-gray-500 text-center'>
						No pending users at the moment.
					</p>
				) : (
					users.map((user) => (
						<div
							key={user._id}
							className='border p-6 mb-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
							<div className='mb-4'>
								<p className='font-semibold'>
									<strong>Username:</strong> {user.username}
								</p>
								<p className='font-semibold'>
									<strong>Role:</strong> {user.role}
								</p>
								<p className='font-semibold'>
									<strong>Status:</strong> {user.registrationStatus}
								</p>
							</div>

							<div className='mb-4'>
								<p className='font-semibold'>
									<strong>Uploaded ID:</strong>{' '}
									<a
										href={`http://localhost:3000/uploads/${user.idFile}`}
										target='_blank'
										rel='noopener noreferrer'
										className='text-blue-600 hover:underline'>
										View ID Document
									</a>
								</p>
							</div>

							<div className='mb-4'>
								<p className='font-semibold'>
									<strong>Additional Documents:</strong>
								</p>
								<ul>
									{user.additionalFiles &&
										user.additionalFiles.map((file, idx) => (
											<li key={idx}>
												<a
													href={`http://localhost:3000/uploads/${file}`}
													target='_blank'
													rel='noopener noreferrer'
													className='text-blue-600 hover:underline'>
													View Additional Document {idx + 1}
												</a>
											</li>
										))}
								</ul>
							</div>

							<div className='mt-4'>
								<button
									onClick={() => handleStatusUpdate(user._id, 'approved')}
									className='px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors mr-3'>
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
		</div>
	);
};

export default AdminDocumentReview;
