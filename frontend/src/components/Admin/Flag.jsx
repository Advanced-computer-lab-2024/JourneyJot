/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FlagItem = ({ item, onFlagToggle, disabled }) => (
	<li className='flex justify-between items-center bg-gray-100 p-3 rounded shadow'>
		<span className='text-lg'>{item.name || 'No details available'}</span>
		<button
			onClick={() => onFlagToggle(item._id)}
			className={`py-1 px-3 rounded focus:outline-none focus:ring ${
				item.flagged
					? 'bg-gray-400 text-white cursor-not-allowed'
					: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300'
			}`}
			disabled={item.flagged || disabled}>
			{item.flagged ? 'Flagged' : 'Flag'}
		</button>
	</li>
);

const Flag = () => {
	const [itineraries, setItineraries] = useState([]);
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const token = localStorage.getItem('token') || ''; // Fallback if token is null

	// Fetch itineraries and activities
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const itinerariesResponse = await axios.get(
					'http://localhost:3000/itineraries/all'
				);
				const activitiesResponse = await axios.get(
					'http://localhost:3000/activities/all'
				);
				setItineraries(itinerariesResponse.data);
				setActivities(activitiesResponse.data.activities);
			} catch (error) {
				setError('Failed to fetch data.');
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Toggle flag for an item
	const toggleFlag = async (id, type) => {
		setLoading(true);
		try {
			const url =
				type === 'itinerary'
					? `http://localhost:3000/admins/itineraries/${id}/`
					: `http://localhost:3000/admins/activities/${id}/`;

			await axios.put(
				url,
				{ flagged: true },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Update the appropriate state
			if (type === 'itinerary') {
				setItineraries((prev) =>
					prev.map((item) =>
						item._id === id ? { ...item, flagged: true } : item
					)
				);
			} else {
				setActivities((prev) =>
					prev.map((item) =>
						item._id === id ? { ...item, flagged: true } : item
					)
				);
			}
		} catch (error) {
			setError('Failed to flag the item.');
			console.error('Error flagging item:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='p-4 w-full max-w-4xl'>
				<button
					onClick={() => navigate(-1)}
					className='text-gray-700 text-xl mb-4 flex items-center hover:text-gray-900 transition'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6 mr-2'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15 19l-7-7 7-7'
						/>
					</svg>
					Back
				</button>
				{/* Flag Itineraries Section */}
				<h2 className='text-2xl font-bold mb-4'>Flag Itineraries</h2>
				{error && <p className='text-red-500'>{error}</p>} {/* Error Message */}
				{loading ? (
					<p className='text-lg text-gray-700'>Loading itineraries...</p>
				) : (
					<ul className='space-y-2'>
						{itineraries.length > 0 ? (
							itineraries.map((itinerary) => (
								<FlagItem
									key={itinerary._id}
									item={itinerary}
									onFlagToggle={(id) => toggleFlag(id, 'itinerary')}
									disabled={loading}
								/>
							))
						) : (
							<p className='text-gray-500'>No itineraries available.</p>
						)}
					</ul>
				)}
				{/* Flag Activities Section */}
				<h2 className='text-2xl font-bold mt-6 mb-4'>Flag Activities</h2>
				{loading ? (
					<p className='text-lg text-gray-700'>Loading activities...</p>
				) : (
					<ul className='space-y-2'>
						{activities.length > 0 ? (
							activities.map((activity) => (
								<FlagItem
									key={activity._id}
									item={activity}
									onFlagToggle={(id) => toggleFlag(id, 'activity')}
									disabled={loading}
								/>
							))
						) : (
							<p className='text-gray-500'>No activities available.</p>
						)}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Flag;
