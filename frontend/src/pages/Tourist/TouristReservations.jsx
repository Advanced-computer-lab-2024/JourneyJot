/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const TouristReservations = () => {
	const [activities, setActivities] = useState([]);
	const [itineraries, setItineraries] = useState([]);
	const [attractions, setAttractions] = useState([]);
	const [activeTab, setActiveTab] = useState('activities');
	const [loading, setLoading] = useState({
		fetchReservations: false,
		cancel: false,
	});
	const navigate = useNavigate();

	useEffect(() => {
		fetchTouristReservations();
	}, []);

	const fetchTouristReservations = async () => {
		setLoading((prev) => ({ ...prev, fetchReservations: true }));
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please login again.');
			}

			const response = await axios.get(
				'http://localhost:3000/tourists/getTourist',
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = response.data;
			setActivities(data.tourist.activities || []);
			setItineraries(data.tourist.itineraries || []);
			setAttractions(data.tourist.attractions || []);
			toast.success('Reservations fetched successfully!');
		} catch (err) {
			const errorMsg =
				err.response?.data?.message ||
				err.message ||
				'Failed to fetch reservations.';
			toast.error(errorMsg);
			console.error('Error fetching reservations:', err);
		} finally {
			setLoading((prev) => ({ ...prev, fetchReservations: false }));
		}
	};

	const cancelReservation = async (type, id, reservationDate) => {
		if (type !== 'Attraction' && !canCancel(reservationDate)) {
			toast.error(
				'This reservation cannot be canceled within 48 hours of the start date.'
			);
			return;
		}

		setLoading((prev) => ({ ...prev, cancel: true }));
		try {
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('No token found. Please login again.');
			}

			const response = await axios.post(
				`http://localhost:3000/tourists/cancel${type}/${id}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);

			const successMsg =
				response.data.message || `${type} canceled successfully!`;
			toast.success(successMsg);
			fetchTouristReservations(); // Refresh reservations after cancellation
		} catch (err) {
			const errorMsg =
				err.response?.data?.message ||
				err.message ||
				`Failed to cancel ${type}.`;
			toast.error(errorMsg);
			console.error(`Error canceling ${type}:`, err);
		} finally {
			setLoading((prev) => ({ ...prev, cancel: false }));
		}
	};

	const canCancel = (reservationDate) => {
		const now = new Date();
		const reservationTime = new Date(reservationDate);
		const diffInHours = (reservationTime - now) / (1000 * 60 * 60);
		return diffInHours > 48;
	};

	const renderCancelButton = (type, id, reservationDate = null) => (
		<button
			className={`mt-2 px-4 py-2 rounded-lg text-white shadow-md transition duration-200 ${
				loading.cancel
					? 'bg-red-400 cursor-not-allowed'
					: 'bg-red-500 hover:bg-red-600'
			}`}
			onClick={() => cancelReservation(type, id, reservationDate)}
			disabled={loading.cancel}>
			{loading.cancel ? 'Canceling...' : 'Cancel'}
		</button>
	);

	const renderTabContent = () => {
		const tabClassNames =
			'p-6 bg-white rounded-lg shadow-md transition-all duration-300';

		const noDataMessage = (
			<div className='text-center text-gray-600 italic'>
				No items to display.
			</div>
		);

		switch (activeTab) {
			case 'activities':
				return activities.length > 0 ? (
					<div className='space-y-8'>
						<h2 className='text-3xl font-bold text-indigo-900'>Activities</h2>
						{activities.map((activity, index) => (
							<div
								key={index}
								className={`${tabClassNames} bg-gradient-to-r from-indigo-100 to-purple-100`}>
								<h3 className='text-2xl font-semibold text-indigo-700'>
									Activity #{index + 1}
								</h3>
								<h2 className='text-xl font-semibold text-gray-800 truncate'>
									{activity.name || 'Activity Name'}
								</h2>
								{activity.advertiserId && (
									<p className='text-gray-800'>
										<strong>Advertiser:</strong>{' '}
										{activity.advertiserId.username}
									</p>
								)}
								<p className='text-gray-700'>
									<strong>Date:</strong>{' '}
									{new Date(activity.date).toLocaleDateString()}
								</p>
								<p className='text-gray-700'>
									<strong>Time:</strong> {activity.time}
								</p>
								{activity.location && activity.location.coordinates && (
									<p className='text-gray-700'>
										<strong>Location:</strong> Longitude:{' '}
										{activity.location.coordinates[0]}, Latitude:{' '}
										{activity.location.coordinates[1]}
									</p>
								)}
								<p className='text-gray-700'>
									<strong>Price:</strong> ${activity.price}
								</p>
								{activity.priceRange && (
									<p className='text-gray-700'>
										<strong>Price Range:</strong> {activity.priceRange}
									</p>
								)}
								{activity.category && (
									<p className='text-gray-700'>
										<strong>Category:</strong> {activity.category.name}
									</p>
								)}
								{activity.preferenceTag && (
									<p className='text-gray-700'>
										<strong>Preference Tag:</strong>{' '}
										{activity.preferenceTag.name}
									</p>
								)}
								{activity.specialDiscounts && (
									<p className='text-gray-700'>
										<strong>Special Discounts:</strong>{' '}
										{activity.specialDiscounts}
									</p>
								)}
								{activity.rating && (
									<p className='text-gray-700'>
										<strong>Rating:</strong> {activity.rating} / 5
									</p>
								)}
								<p className='text-gray-700'>
									<strong>Booking Open:</strong>{' '}
									{activity.bookingOpen ? 'Yes' : 'No'}
								</p>
								{renderCancelButton('Activity', activity._id, activity.date)}
							</div>
						))}
					</div>
				) : (
					<div className='text-gray-500'>No activities available.</div>
				);
			case 'itineraries':
				return itineraries.length > 0 ? (
					<div className='space-y-8'>
						<h2 className='text-3xl font-bold text-indigo-900'>Itineraries</h2>
						{itineraries.map((itinerary, index) => (
							<div
								key={index}
								className={`${tabClassNames} bg-gradient-to-r from-pink-100 to-yellow-100`}>
								<h3 className='text-2xl font-semibold text-pink-700'>
									Itinerary #{index + 1}
								</h3>
								<h2 className='text-xl font-semibold text-gray-800 truncate'>
									{itinerary.name || 'Itinerary Name'}
								</h2>
								<p className='text-gray-800'>
									<strong>Tour Guide:</strong> {itinerary.tourGuideId?.username}
								</p>
								<p className='text-gray-700'>
									<strong>Activities:</strong> {itinerary.activities.join(', ')}
								</p>
								<p className='text-gray-700'>
									<strong>Locations:</strong> {itinerary.locations.join(', ')}
								</p>
								<p className='text-gray-700'>
									<strong>Timeline:</strong> {itinerary.timeline}
								</p>
								<p className='text-gray-700'>
									<strong>Duration:</strong> {itinerary.duration}
								</p>
								<p className='text-gray-700'>
									<strong>Language:</strong> {itinerary.language}
								</p>
								<p className='text-gray-700'>
									<strong>Price:</strong> ${itinerary.price}
								</p>
								{itinerary.rating && (
									<p className='text-gray-700'>
										<strong>Rating:</strong> {itinerary.rating} / 5
									</p>
								)}
								<p className='text-gray-700'>
									<strong>Accessibility:</strong> {itinerary.accessibility}
								</p>
								<p className='text-gray-700'>
									<strong>Pickup Location:</strong> {itinerary.pickupLocation}
								</p>
								<p className='text-gray-700'>
									<strong>Dropoff Location:</strong> {itinerary.dropoffLocation}
								</p>
								<p className='text-gray-700'>
									<strong>Available Dates:</strong>{' '}
									{itinerary.availableDates.join(', ')}
								</p>
								{renderCancelButton(
									'Itinerary',
									itinerary._id,
									itinerary.availableDates[0] // Assuming the first date for cancellation
								)}
							</div>
						))}
					</div>
				) : (
					<div className='text-gray-500'>No itineraries available.</div>
				);
			case 'attractions':
				return attractions.length > 0 ? (
					<div className='space-y-8'>
						<h2 className='text-3xl font-bold text-indigo-900'>Attractions</h2>
						{attractions.map((attraction, index) => (
							<div
								key={index}
								className={`${tabClassNames} bg-gradient-to-r from-green-100 to-teal-100`}>
								<h2 className='text-xl font-semibold text-gray-800 truncate'>
									{attraction.name || 'Attraction Name'}
								</h2>
								{attraction.governorId && (
									<p className='text-gray-800'>
										<strong>Governor:</strong> {attraction.governorId?.username}
									</p>
								)}
								{attraction.description && (
									<p className='text-gray-800'>
										<strong>Description:</strong> {attraction.description}
									</p>
								)}
								{attraction.pictures?.length > 0 && (
									<div className='space-y-2'>
										<strong>Pictures:</strong>
										<div className='flex space-x-2'>
											{attraction.pictures.map((pic, idx) => (
												<img
													key={idx}
													src={pic}
													alt={`Attraction picture ${idx + 1}`}
													className='w-32 h-32 object-cover rounded'
												/>
											))}
										</div>
									</div>
								)}
								<p className='text-gray-700'>
									<strong>Location:</strong> {attraction.location}
								</p>
								<p className='text-gray-700'>
									<strong>Opening Hours:</strong> {attraction.openingHours}
								</p>
								{attraction.ticketPrices && (
									<div className='text-gray-700'>
										<strong>Ticket Prices:</strong>
										<ul className='list-disc list-inside'>
											{Object.entries(attraction.ticketPrices).map(
												([age, price]) => (
													<li key={age}>
														{age}: ${price}
													</li>
												)
											)}
										</ul>
									</div>
								)}
								<p className='text-gray-700'>
									<strong>Rating:</strong> {attraction.rating} / 5
								</p>
								{renderCancelButton('Attraction', attraction._id)}
							</div>
						))}
					</div>
				) : (
					<div className='text-gray-500'>No attractions available.</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8'>
			<ToastContainer />
			<div className='max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg'>
				<button
					onClick={() => navigate(-1)}
					className='text-sm text-gray-700 hover:text-gray-900 flex items-center'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 mr-2'
						viewBox='0 0 24 24'
						fill='none'
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
				<div className='flex justify-center space-x-4 my-4'>
					{['activities', 'itineraries', 'attractions'].map((tab) => (
						<button
							key={tab}
							className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
								activeTab === tab
									? 'bg-indigo-500 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
							onClick={() => setActiveTab(tab)}>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					))}
				</div>
				<div className='space-y-4'>{renderTabContent()}</div>
			</div>
		</div>
	);
};

export default TouristReservations;
