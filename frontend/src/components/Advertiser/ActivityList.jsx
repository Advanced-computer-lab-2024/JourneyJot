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
				setActivities(response.data); // Set the response data to activities state
			} catch (err) {
				setError(err.message); // Handle error
			}
		};

		fetchActivities();
	}, []);

	return (
		<div>
			<h1>Completed Activities</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<ul>
				{activities.length > 0 ? (
					activities.map((activity) => (
						<li key={activity._id}>
							<h3>{activity.name}</h3>
							<p>Date: {new Date(activity.date).toLocaleDateString()}</p>
							<p>Description: {activity.description}</p>
						</li>
					))
				) : (
					<p>No completed activities found.</p>
				)}
			</ul>
		</div>
	);
};

export default ActivityList;
