/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios

const ActivityList = () => {
	const [activities, setActivities] = useState([]);
	const [error, setError] = useState(null);

	// Fetch completed activities from the backend using Axios
	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const response = await axios.get(
					'http://localhost:3000/activities/complete'
				); // Use Axios for the GET request

				console.log(response.data); // Log the response to check the data structure

				// If the data is wrapped inside an object (like { activities: [...] }), adjust accordingly
				if (response.data.activities) {
					setActivities(response.data.activities); // Extract activities if they're inside an object
				} else {
					setActivities(response.data); // Otherwise, directly use the response
				}
			} catch (err) {
				setError(err.message); // Handle error
			}
		};

		fetchActivities();
	}, []); // Empty dependency array to run once on component mount

	// Function to toggle visibility of the activity details
	const toggleDetails = (id) => {
		setActivities((prevActivities) =>
			prevActivities.map((activity) =>
				activity._id === id
					? { ...activity, showDetails: !activity.showDetails }
					: activity
			)
		);
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold text-center mb-6'>
				Completed Activities
			</h1>
			{error && <p className='text-red-500 text-center'>{error}</p>}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{activities.length > 0 ? (
					activities.map((activity) => (
						<div
							key={activity._id}
							className='bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300'>
							<h3 className='text-xl font-semibold mb-2'>{activity.name}</h3>
							<p className='text-gray-600'>
								Advertiser: {activity.advertiserId?.username || 'N/A'}
							</p>
							<p className='text-gray-600'>
								Date: {new Date(activity.date).toLocaleDateString()}
							</p>

							{activity.showDetails && (
								<>
									<p className='text-gray-600'>Price: ${activity.price}</p>
									<p className='text-gray-600'>
										Category: {activity.category?.name || 'N/A'}
									</p>
									<p className='text-gray-600'>
										Preference Tag: {activity.preferenceTag?.name || 'N/A'}
									</p>
									{activity.priceRange && (
										<p className='text-gray-600'>
											Price Range: {activity.priceRange}
										</p>
									)}
								</>
							)}

							<div className='mt-4'>
								<button
									onClick={() => toggleDetails(activity._id)}
									className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200'>
									{activity.showDetails ? 'Hide Details' : 'View Details'}
								</button>
							</div>
						</div>
					))
				) : (
					<p className='text-center text-gray-500'>
						No completed activities found.
					</p>
				)}
			</div>
		</div>
	);
};

export default ActivityList;
