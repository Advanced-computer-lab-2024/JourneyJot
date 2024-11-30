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

			const response = await fetch('http://localhost:3000/tourists/getTourist', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log(data); // Log the entire response to inspect the structure

			setActivities(data.tourist.activities);
			setItineraries(data.tourist.itineraries);

			const bookedAttractions = data.tourist.bookedAttractions
				? Object.keys(data.tourist.bookedAttractions)
				: [];

			console.log(bookedAttractions); // Log the booked attractions

			const attractionDetails = await Promise.all(
				bookedAttractions.map((attractionId) => fetchAttractionDetails(attractionId))
			);
			setAttractions(attractionDetails);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchAttractionDetails = async (attractionId) => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`http://localhost:3000/attractions/${attractionId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Error fetching attraction details: ${response.status}`);
			}

			const attractionData = await response.json();
			console.log(attractionData); // Log attraction data to inspect it
			return attractionData;
		} catch (err) {
			console.error('Error fetching attraction details:', err);
			return null; // Return null in case of error
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
			onClick={() => cancelReservation(type, id, reservationDate)} >
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
								{activity.advertiserId && (
									<p className='text-gray-800'>
										<strong>Advertiser:</strong> {activity.advertiserId.username}
									</p>
								)}
								<p className='text-gray-700'>
									<strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
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
								{renderCancelButton('Itinerary', itinerary._id, itinerary.date)}
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
									Attraction #{index + 1}
								</h3>
								<p className='text-gray-800'>
									<strong>Name:</strong> {attraction.name}
								</p>
								<p className='text-gray-700'>
									<strong>Location:</strong> {attraction.location}
								</p>
								<p className='text-gray-700'>
									<strong>Duration:</strong> {attraction.duration}
								</p>
								{renderCancelButton('Attraction', attraction._id, attraction.date)}
							</div>
						))}
					</div>
				) : (
					<div className='text-gray-500'>No attractions available.</div>
				);
			default:
				return <div>Please select a tab.</div>;
		}
	};

	return (
		<div className='container'>
			{/* Top Tabs / Buttons */}
			<div className='tabs flex space-x-4 mb-6'>
				<button
					onClick={() => setActiveTab('activities')}
					className={`${activeTab === 'activities' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
						} px-6 py-2 rounded-md font-semibold transition-colors duration-300 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50`}>
					Activities
				</button>
				<button
					onClick={() => setActiveTab('itineraries')}
					className={`${activeTab === 'itineraries' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
						} px-6 py-2 rounded-md font-semibold transition-colors duration-300 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50`}>
					Itineraries
				</button>
				<button
					onClick={() => setActiveTab('attractions')}
					className={`${activeTab === 'attractions' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
						} px-6 py-2 rounded-md font-semibold transition-colors duration-300 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50`}>
					Attractions
				</button>
			</div>

			{/* Error Message */}
			{errorMessage && (
				<div className='error-message text-red-600'>{errorMessage}</div>
			)}

			{/* Tab Content */}
			<div className='tab-content'>
				{renderTabContent()}
			</div>
		</div>
	);
};

export default TouristReservations;
