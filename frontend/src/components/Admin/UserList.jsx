/** @format */

// components/UserList.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
			try {
				const response = await axios.get('http://localhost:3000/admins/users', {
					headers: {
						Authorization: `Bearer ${token}`, // Include token in Authorization header
					},
				});
				setUsers(response.data); // Adjust based on your API response structure
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	if (loading) return <p className='text-center py-4'>Loading users...</p>;
	if (error)
		return <p className='text-center text-red-500 py-4'>Error: {error}</p>;

	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full border border-gray-300'>
				<thead className='bg-gray-100'>
					<tr>
						<th className='border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700'>
							Username
						</th>
						<th className='border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700'>
							Email
						</th>
						<th className='border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700'>
							Role
						</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr
							key={user._id}
							className='hover:bg-gray-50 transition-colors'>
							<td className='border border-gray-300 px-4 py-2'>
								{user.username}
							</td>
							<td className='border border-gray-300 px-4 py-2'>{user.email}</td>
							<td className='border border-gray-300 px-4 py-2'>{user.role}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UserList;
