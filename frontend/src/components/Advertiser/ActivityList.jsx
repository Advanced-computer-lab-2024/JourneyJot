/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ActivityList = () => {
	const [activities, setActivities] = useState([]);
	const [itineraries, setItineraries] = useState([]);
	const [tourGuides, setTourGuides] = useState([]);
	const [activeTab, setActiveTab] = useState('activities');
	const [showModal, setShowModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					throw new Error('No token found. Please login again.');
				}
				const config = { headers: { Authorization: `Bearer ${token}` } };
				const response = await axios.get(
					'http://localhost:3000/tourists/completedActivities',
					config
				);
				setActivities(response.data.completedActivities);
			} catch (error) {
				console.error('Error fetching activities:', error.message);
			}
		};

		const fetchItineraries = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					throw new Error('No token found. Please login again.');
				}
				const config = { headers: { Authorization: `Bearer ${token}` } };
				const response = await axios.get(
					'http://localhost:3000/tourists/completedItineraries',
					config
				);
				setItineraries(response.data.completedItineraries);
				setTourGuides(response.data.completedItineraries);
			} catch (error) {
				console.error('Error fetching itineraries:', error.message);
			}
		};

		fetchActivities();
		fetchItineraries();
	}, []);

	const handleReviewClick = (item) => {
		setSelectedItem(item);
		setShowModal(true);
	};

	const handleSubmitReview = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please login again.');
			}
			const config = { headers: { Authorization: `Bearer ${token}` } };
			const reviewData = { rating, comment };

			if (selectedItem.type === 'activity') {
				await axios.post(
					`http://localhost:3000/activities/review/${selectedItem._id}`,
					reviewData,
					config
				);
			} else if (selectedItem.type === 'itinerary') {
				await axios.post(
					`http://localhost:3000/itineraries/review/${selectedItem._id}`,
					reviewData,
					config
				);
			} else if (selectedItem.type === 'tourGuide') {
				await axios.post(
					`http://localhost:3000/tour-guides/review/${selectedItem.tourGuideId._id}`,
					reviewData,
					config
				);
			}

			setShowModal(false);
		} catch (error) {
			console.error('Error submitting review:', error.message);
		}
	};

	const renderStars = () => (
		<div className='flex gap-1 text-yellow-500'>
			{[1, 2, 3, 4, 5].map((star) => (
				<span
					key={star}
					onClick={() => setRating(star)}
					className={`cursor-pointer ${
						star <= rating ? 'text-yellow-400' : 'text-gray-300'
					}`}>
					★
				</span>
			))}
		</div>
	);

	return (
		<div className='container mx-auto py-8 px-4'>
			<h1 className='text-3xl font-bold text-center mb-8'>
				Your Completed Experiences
			</h1>

			{/* Tabs */}
			<div className='flex justify-center mb-8'>
				<button
					className={`px-4 py-2 rounded-t-lg font-semibold transition duration-300 ${
						activeTab === 'activities'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-600 hover:bg-gray-300'
					}`}
					onClick={() => setActiveTab('activities')}>
					Activities
				</button>
				<button
					className={`ml-2 px-4 py-2 rounded-t-lg font-semibold transition duration-300 ${
						activeTab === 'itineraries'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-600 hover:bg-gray-300'
					}`}
					onClick={() => setActiveTab('itineraries')}>
					Itineraries
				</button>
				<button
					className={`ml-2 px-4 py-2 rounded-t-lg font-semibold transition duration-300 ${
						activeTab === 'tourGuides'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-600 hover:bg-gray-300'
					}`}
					onClick={() => setActiveTab('tourGuides')}>
					Tour Guides
				</button>
			</div>

			{/* Tab Content */}
			<div className='bg-white rounded-lg shadow-lg p-6'>
				{activeTab === 'activities' &&
					activities.map((activity, index) => (
						<div
							key={index}
							className='p-4 border-b border-gray-200 last:border-none rounded-lg shadow-lg mb-4'>
							<h3 className='text-xl font-semibold text-gray-800'>
								{activity.advertiserId.username}'s Activity
							</h3>
							<p className='text-gray-600'>
								Date: {new Date(activity.date).toLocaleDateString()}
							</p>
							<div className='flex flex-col justify-center items-center'>
								<button
									className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition duration-200 mt-4'
									onClick={() =>
										handleReviewClick({ ...activity, type: 'activity' })
									}>
									Add Review
								</button>
								<Link
									to={`activityDetails/${activity._id}`}
									className='text-gray-500 hover:text-gray-700 transition'>
									View Details
								</Link>
							</div>
						</div>
					))}

				{activeTab === 'itineraries' &&
					itineraries.map((itinerary, index) => (
						<div
							key={index}
							className='p-4 border-b border-gray-200 last:border-none rounded-lg shadow-lg mb-4'>
							<h3 className='text-xl font-semibold text-gray-800'>
								{itinerary.tourGuideId.username}'s Itinerary
							</h3>
							{itinerary.availableDates &&
							itinerary.availableDates.length > 0 ? (
								itinerary.availableDates.map((dateObj, index) => (
									<p
										key={index}
										className='text-gray-600'>
										Date: {new Date(dateObj).toLocaleDateString()}
									</p>
								))
							) : (
								<p className='text-gray-600'>No available dates</p>
							)}

							<div className='flex flex-col justify-center items-center'>
								<button
									className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition duration-200 mt-4'
									onClick={() =>
										handleReviewClick({ ...itinerary, type: 'itinerary' })
									}>
									Add Review
								</button>
								<Link
									to={`itineraryDetails/${itinerary._id}`}
									className='text-gray-500 hover:text-gray-700 transition'>
									View Details
								</Link>
							</div>
						</div>
					))}

				{activeTab === 'tourGuides' &&
					tourGuides.map((tourGuide, index) => (
						<div
							key={index}
							className='p-4 border-b border-gray-200 last:border-none rounded-lg shadow-lg mb-4'>
							<h3 className='text-xl font-semibold text-gray-800'>
								{tourGuide.tourGuideId.username}
							</h3>

							<div className='flex flex-col justify-center items-center'>
								<button
									className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition duration-200 mt-4'
									onClick={() =>
										handleReviewClick({ ...tourGuide, type: 'tourGuide' })
									}>
									Add Review
								</button>
								<Link
									to={`tourGuideDetails/${tourGuide.tourGuideId._id}`}
									className='text-gray-500 hover:text-gray-700 transition'>
									View Details
								</Link>
							</div>
						</div>
					))}
			</div>

			{/* Modal for submitting review */}
			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-white w-96 p-6 rounded-lg shadow-lg'>
						<h2 className='text-2xl font-semibold mb-4 text-center'>
							Add Review
						</h2>
						<div className='mb-4'>
							<label className='block text-sm font-medium mb-1'>Rating</label>
							{renderStars()}
						</div>
						<div className='mb-4'>
							<label className='block text-sm font-medium mb-1'>Comment</label>
							<textarea
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								className='w-full p-2 border border-gray-300 rounded-md resize-none'
								rows='4'
							/>
						</div>
						<div className='flex justify-end gap-2'>
							<button
								onClick={handleSubmitReview}
								className='bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-800 transition'>
								Submit
							</button>
							<button
								onClick={() => setShowModal(false)}
								className='bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ActivityList;
