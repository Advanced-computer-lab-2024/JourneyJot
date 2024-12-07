/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineWarning } from 'react-icons/ai'; // Warning icon for flagged itineraries
import { BiCheckCircle } from 'react-icons/bi'; // Check icon for active itineraries
import { useNavigate } from 'react-router-dom';

const DisplayNotificationItinerary = () => {
	const [itineraries, setItineraries] = useState([]);
	const [flaggedItineraries, setFlaggedItineraries] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const API_URL = 'http://localhost:3000/tour-guides/notifications';

	// Fetch itineraries and notifications
	const fetchItineraries = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token'); // Retrieve token from localStorage
			const response = await axios.get(API_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setItineraries(response.data.itineraries);
			setFlaggedItineraries(response.data.flaggedItineraries);
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Error fetching itineraries'
			);
		} finally {
			setLoading(false);
		}
	};

	// Trigger the fetch on component mount
	useEffect(() => {
		fetchItineraries();
	}, []);

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-300 flex items-center justify-center p-6'>
			<div className='bg-white shadow-xl rounded-lg p-8 max-w-3xl w-full'>
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
				<h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center'>
					Itinerary Notifications
				</h1>

				{/* Loading and error handling */}
				{loading ? (
					<div className='flex justify-center items-center'>
						<p className='text-lg font-medium text-blue-500 animate-pulse'>
							Loading itineraries...
						</p>
					</div>
				) : error ? (
					<div className='text-center bg-red-100 text-red-700 py-3 px-4 rounded-lg shadow-sm'>
						<p>{error}</p>
					</div>
				) : (
					<>
						{/* Flagged Itineraries Notification */}
						{flaggedItineraries.length > 0 && (
							<div className='mb-6 p-4 bg-red-50 border border-red-400 rounded-lg shadow-md'>
								<div className='flex items-center space-x-3'>
									<AiOutlineWarning className='text-red-500 text-xl' />
									<div>
										<p className='font-semibold text-red-600'>
											Alert: Some itineraries are flagged!
										</p>
										<ul className='list-disc list-inside text-gray-700 mt-2'>
											{flaggedItineraries.map((itinerary) => (
												<li key={itinerary._id}>
													<span className='font-medium'>{itinerary.name}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						)}

						{/* All Itineraries List */}
						<h2 className='text-lg font-semibold text-gray-800 mb-4'>
							All Itineraries
						</h2>
						<div className='grid grid-cols-1 gap-6'>
							{itineraries.map((itinerary) => (
								<div
									key={itinerary._id}
									className={`p-4 rounded-lg shadow-sm ${
										itinerary.flagged
											? 'bg-red-50 border border-red-400'
											: 'bg-green-50 border border-green-400'
									}`}>
									<div className='flex items-center justify-between'>
										<p className='text-lg font-medium text-gray-800'>
											{itinerary.name}
										</p>
										{itinerary.flagged ? (
											<span className='flex items-center text-red-600'>
												<AiOutlineWarning className='mr-1' />
												Flagged
											</span>
										) : (
											<span className='flex items-center text-green-600'>
												<BiCheckCircle className='mr-1' />
												Active
											</span>
										)}
									</div>
									<p className='mt-1 text-sm text-gray-600'>
										{itinerary.flagged
											? 'This itinerary requires immediate attention.'
											: 'This itinerary is currently active.'}
									</p>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default DisplayNotificationItinerary;
