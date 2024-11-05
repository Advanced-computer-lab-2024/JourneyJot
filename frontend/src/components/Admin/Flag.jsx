/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Flag = () => {
	const [itineraries, setItineraries] = useState([]);
	const [activities, setActivities] = useState([]);

	const token = localStorage.getItem('token');
	console.log('Auth Token:', token); // Debugging the token

	// Fetch itineraries and activities on component mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const itinerariesResponse = await axios.get(
					'http://localhost:3000/itineraries'
				);
				const activitiesResponse = await axios.get(
					'http://localhost:3000/activities'
				);
				setItineraries(itinerariesResponse.data);
				setActivities(activitiesResponse.data.activities);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, []);

	// Toggle flag for itinerary
	const toggleItineraryFlag = async (id) => {
		try {
			await axios.put(
				`http://localhost:3000/admins/itineraries/${id}/`,
				{ flagged: true }, // Only flag the itinerary
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setItineraries((prev) =>
				prev.map((itinerary) =>
					itinerary._id === id ? { ...itinerary, flagged: true } : itinerary
				)
			);
		} catch (error) {
			console.error('Error flagging itinerary:', error);
		}
	};

	// Toggle flag for activity
	const toggleActivityFlag = async (id) => {
		try {
			await axios.put(
				`http://localhost:3000/admins/activities/${id}/`,
				{ flagged: true }, // Only flag the activity
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setActivities((prev) =>
				prev.map((activity) =>
					activity._id === id ? { ...activity, flagged: true } : activity
				)
			);
		} catch (error) {
			console.error('Error flagging activity:', error);
		}
	};

	return (
		<div className='p-4'>
			<h2 className='text-2xl font-bold mb-4'>Flag Itineraries</h2>
			<ul className='space-y-2'>
				{itineraries.map((itinerary) => (
					<li
						key={itinerary._id}
						className='flex justify-between items-center bg-gray-100 p-3 rounded shadow'>
						<span className='text-lg'>
							{itinerary.timeline || 'No timeline available'}
						</span>
						<button
							onClick={() => toggleItineraryFlag(itinerary._id)}
							className='bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300'>
							Flag
						</button>
					</li>
				))}
			</ul>

			<h2 className='text-2xl font-bold mt-6 mb-4'>Flag Activities</h2>
			<ul className='space-y-2'>
				{activities.map((activity) => (
					<li
						key={activity._id}
						className='flex justify-between items-center bg-gray-100 p-3 rounded shadow'>
						<span className='text-lg'>
							{activity.category?.name || 'No category available'}
						</span>
						<button
							onClick={() => toggleActivityFlag(activity._id)}
							className='bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300'>
							Flag
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Flag;
