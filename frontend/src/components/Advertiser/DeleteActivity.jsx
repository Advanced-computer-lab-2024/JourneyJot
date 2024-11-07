/** @format */

// DeleteActivityButton.js
import React from 'react';
import axios from 'axios';

const DeleteActivity = ({ activityId, onDelete }) => {
	const handleDelete = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please login again.');
			}

			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			await axios.delete(
				`http://localhost:3000/activities/${activityId}`,
				config
			);

			onDelete(activityId); // Notify parent component of the deletion
			console.log('Activity deleted successfully');
		} catch (error) {
			console.error('Error deleting activity:', error);
		}
	};

	return (
		<button
			onClick={handleDelete}
			className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
			Delete
		</button>
	);
};

export default DeleteActivity;
