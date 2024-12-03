/** @format */

import React, { useEffect, useState } from 'react';

const TouristReservations = () => {
	const [activities, setActivities] = useState([]);
	const [itineraries, setItineraries] = useState([]);
	const [attractions, setAttractions] = useState([]);
	const [activeTab, setActiveTab] = useState('activities'); // default to activities tab
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		fetchTouristReservations();
	}, []);

	const fetchTouristReservations = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please login again.');
			}

			const response = await fetch(
				'http://localhost:3000/tourists/getTourist',
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			setActivities(data.tourist.activities);
			setItineraries(data.tourist.itineraries);
			setAttractions(data.tourist.attractions);
		} catch (err) {
			console.error(err);
		}
	};

	const cancelReservation = async (type, id, reservationDate) => {
		if (type !== 'Attraction' && !canCancel(reservationDate)) {
			setErrorMessage(
				'This reservation cannot be canceled within 48 hours of the start date.'
			);
			setTimeout(() => setErrorMessage(''), 5000); // Clear message after 5 seconds
			return;
		}

		try {
			const token = localStorage.getItem('token');

			const response = await fetch(
				`http://localhost:3000/tourists/cancel${type}/${id}`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to cancel ${type}. Status: ${response.status}`);
			}

			alert(`${type} cancelled successfully!`);
			fetchTouristReservations(); // Refresh reservations after cancellation
		} catch (error) {
			console.error(`Error canceling ${type}:`, error);
			alert(`Failed to cancel ${type}.`);
		}
	};

	const canCancel = (reservationDate) => {
		const now = new Date();
		const reservationTime = new Date(reservationDate);
		const diffInHours = (reservationTime - now) / (1000 * 60 * 60);
		return diffInHours > 48;
	};

	const renderCancelButton = (type, id, reservationDate) => (
		<button
			className='mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
			onClick={() => cancelReservation(type, id, reservationDate)}>
			Cancel
		</button>
	);

	const renderTabContent = () => {
		const tabClassNames =
			'p-6 bg-white rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105';

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
								<p className='text-gray-700'>
									<strong>ActivityName:</strong> {activity.name}
								</p>
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
								<p className='text-gray-700'>
									<strong>ItineraryName:</strong> {itinerary.name}
								</p>
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
									itinerary.availableDates
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
								<h3 className='text-2xl font-semibold text-green-700'>
									{attraction.name}
								</h3>
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
		<div className='p-8 max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-xl'>
			<div className='flex justify-center space-x-6 mb-10'>
				{['activities', 'itineraries', 'attractions'].map((tab) => (
					<button
						key={tab}
						className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
							activeTab === tab
								? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
								: 'bg-gray-200 text-gray-600 hover:bg-gray-300'
						}`}
						onClick={() => setActiveTab(tab)}>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				))}
			</div>
			{errorMessage && (
				<div className='mb-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded'>
					{errorMessage}
				</div>
			)}
			<div>{renderTabContent()}</div>
		</div>
	);
};

export default TouristReservations;
