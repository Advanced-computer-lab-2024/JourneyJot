/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TouristReservations = () => {
	const [activities, setActivities] = useState([]);
	const [itineraries, setItineraries] = useState([]);
	const [attractions, setAttractions] = useState([]);
	const [activeTab, setActiveTab] = useState('activities');

	useEffect(() => {
		fetchTouristReservations();
	}, []);

	const fetchTouristReservations = async () => {
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
			const response = await axios.get(
				'http://localhost:3000/tourists/getTourist',
				config
			);
			setActivities(response.data.tourist.activities);
			setItineraries(response.data.tourist.itineraries);
			setAttractions(response.data.tourist.attractions);
		} catch (err) {
			console.error(err);
		}
	};

	const renderTabContent = () => {
		const tabClassNames = 'p-4 bg-white rounded-lg shadow-lg space-y-4';

		switch (activeTab) {
			case 'activities':
				return activities.length > 0 ? (
					<div className='space-y-6'>
						<h2 className='text-2xl font-semibold text-gray-800'>Activities</h2>
						{activities.map((activity, index) => (
							<div
								key={index}
								className={tabClassNames}>
								<h3 className='text-lg font-semibold text-gray-800'>
									Activity #{index + 1}
								</h3>
								{activity.advertiserId && (
									<p className='text-gray-700'>
										<span className='font-medium'>Advertiser:</span>{' '}
										{activity.advertiserId?.username}
									</p>
								)}
								<p className='text-gray-700'>
									<span className='font-medium'>Date:</span>{' '}
									{new Date(activity.date).toLocaleDateString()}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Time:</span> {activity.time}
								</p>
								{activity.location?.coordinates && (
									<p className='text-gray-700'>
										<span className='font-medium'>Location:</span> Longitude:{' '}
										{activity.location.coordinates[0]}, Latitude:{' '}
										{activity.location.coordinates[1]}
									</p>
								)}
								<p className='text-gray-700'>
									<span className='font-medium'>Price:</span> ${activity.price}
								</p>
								{activity.priceRange && (
									<p className='text-gray-700'>
										<span className='font-medium'>Price Range:</span>{' '}
										{activity.priceRange}
									</p>
								)}
								{activity.category && (
									<p className='text-gray-700'>
										<span className='font-medium'>Category:</span>{' '}
										{activity.category.name}
									</p>
								)}
								{activity.preferenceTag && (
									<p className='text-gray-700'>
										<span className='font-medium'>Preference Tag:</span>{' '}
										{activity.preferenceTag.name}
									</p>
								)}
								{activity.specialDiscounts && (
									<p className='text-gray-700'>
										<span className='font-medium'>Special Discounts:</span>{' '}
										{activity.specialDiscounts}
									</p>
								)}
								{activity.rating && (
									<p className='text-gray-700'>
										<span className='font-medium'>Rating:</span>{' '}
										{activity.rating} / 5
									</p>
								)}
								<p className='text-gray-700'>
									<span className='font-medium'>Booking Open:</span>{' '}
									{activity.bookingOpen ? 'Yes' : 'No'}
								</p>
							</div>
						))}
					</div>
				) : (
					<div className='text-gray-500'>No activities available.</div>
				);
			case 'itineraries':
				return itineraries.length > 0 ? (
					<div className='space-y-6'>
						<h2 className='text-2xl font-semibold text-gray-800'>
							Itineraries
						</h2>
						{itineraries.map((itinerary, index) => (
							<div
								key={index}
								className={tabClassNames}>
								<h3 className='text-lg font-semibold text-gray-800'>
									Itinerary #{index + 1}
								</h3>
								<p className='text-gray-700'>
									<span className='font-medium'>Tour Guide:</span>{' '}
									{itinerary.tourGuideId?.username}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Activities:</span>{' '}
									{itinerary.activities.join(', ')}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Locations:</span>{' '}
									{itinerary.locations.join(', ')}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Timeline:</span>{' '}
									{itinerary.timeline}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Duration:</span>{' '}
									{itinerary.duration}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Language:</span>{' '}
									{itinerary.language}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Price:</span> ${itinerary.price}
								</p>
								{itinerary.rating && (
									<p className='text-gray-700'>
										<span className='font-medium'>Rating:</span>{' '}
										{itinerary.rating} / 5
									</p>
								)}
								<p className='text-gray-700'>
									<span className='font-medium'>Accessibility:</span>{' '}
									{itinerary.accessibility}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Pickup Location:</span>{' '}
									{itinerary.pickupLocation}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Dropoff Location:</span>{' '}
									{itinerary.dropoffLocation}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Available Dates:</span>{' '}
									{itinerary.availableDates.join(', ')}
								</p>
							</div>
						))}
					</div>
				) : (
					<div className='text-gray-500'>No itineraries available.</div>
				);
			case 'attractions':
				return attractions.length > 0 ? (
					<div className='space-y-6'>
						<h2 className='text-2xl font-semibold text-gray-800'>
							Attractions
						</h2>
						{attractions.map((attraction, index) => (
							<div
								key={index}
								className={tabClassNames}>
								<h3 className='text-lg font-semibold text-gray-800'>
									{attraction.name}
								</h3>
								{attraction.governorId && (
									<p className='text-gray-700'>
										<span className='font-medium'>Governor:</span>{' '}
										{attraction.governorId?.username}
									</p>
								)}
								{attraction.description && (
									<p className='text-gray-700'>
										<span className='font-medium'>Description:</span>{' '}
										{attraction.description}
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
									<span className='font-medium'>Location:</span>{' '}
									{attraction.location}
								</p>
								<p className='text-gray-700'>
									<span className='font-medium'>Opening Hours:</span>{' '}
									{attraction.openingHours}
								</p>
								{attraction.ticketPrices && (
									<div className='text-gray-700'>
										<span className='font-medium'>Ticket Prices:</span>
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
									<span className='font-medium'>Rating:</span>{' '}
									{attraction.rating} / 5
								</p>
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
		<div className='container mx-auto p-6'>
			<div className='flex space-x-4 mb-4'>
				<button
					onClick={() => setActiveTab('activities')}
					className={`${
						activeTab === 'activities'
							? 'bg-blue-600 text-white'
							: 'bg-blue-200'
					} px-4 py-2 rounded-md hover:bg-blue-400 transition`}>
					Activities
				</button>
				<button
					onClick={() => setActiveTab('itineraries')}
					className={`${
						activeTab === 'itineraries'
							? 'bg-green-600 text-white'
							: 'bg-green-200'
					} px-4 py-2 rounded-md hover:bg-green-400 transition`}>
					Itineraries
				</button>
				<button
					onClick={() => setActiveTab('attractions')}
					className={`${
						activeTab === 'attractions'
							? 'bg-yellow-600 text-white'
							: 'bg-yellow-200'
					} px-4 py-2 rounded-md hover:bg-yellow-400 transition`}>
					Attractions
				</button>
			</div>
			<div>{renderTabContent()}</div>
		</div>
	);
};

export default TouristReservations;
