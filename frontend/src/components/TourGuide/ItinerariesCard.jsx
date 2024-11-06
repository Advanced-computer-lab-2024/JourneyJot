/** @format */

import React from 'react';

const ItinerariesCard = ({ itineraries = [] }) => {
	const handleShareItinerary = (itinerary) => {
		alert(`Share link for itinerary: ${itinerary.name}`);
		// Implement actual sharing logic here
	};
	const handleBookItinerary = (itinerary) => {
		alert(`Book ${itinerary.name}`);
		// Implement actual booking logic here
	};
	return (
		<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
			{itineraries.length > 0 ? (
				itineraries.map((itinerary) => (
					<div
						key={itinerary._id}
						className='border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300'>
						<div className='flex flex-col h-full space-y-4 text-left'>
							<h2 className='text-xl font-semibold text-blue-900'>Itinerary</h2>
							<ul className='list-disc list-inside space-y-2 text-gray-700'>
								{/* Tour Guide ID (optional display) */}
								<li>
									<span className='font-semibold'>Tour Guide Name: </span>
									{itinerary.tourGuideId?.username || 'Unknown'}{' '}
									{/* Use the `username` field or any other relevant property */}
								</li>

								{/* Itinerary Title (assumed as part of activities) */}
								<li>
									<span className='font-semibold'>Activities: </span>
									{itinerary.activities.join(', ')}
								</li>

								{/* Locations */}
								<li>
									<span className='font-semibold'>Locations: </span>
									{itinerary.locations.join(', ')}
								</li>

								{/* Timeline */}
								<li>
									<span className='font-semibold'>Timeline: </span>
									{itinerary.timeline}
								</li>

								{/* Duration */}
								<li>
									<span className='font-semibold'>Duration: </span>
									{itinerary.duration}
								</li>

								{/* Language */}
								<li>
									<span className='font-semibold'>Language: </span>
									{itinerary.language}
								</li>

								{/* Price */}
								<li>
									<span className='font-semibold'>Price: </span>$
									{itinerary.price}
								</li>

								{/* Rating */}
								{typeof itinerary.rating === 'number' && (
									<li>
										<span className='font-semibold'>Rating: </span>
										{itinerary.rating} / 5
									</li>
								)}

								{/* Available Dates */}
								<li>
									<span className='font-semibold'>Available Dates: </span>
									{itinerary.availableDates
										.map((date) => new Date(date).toLocaleDateString())
										.join(', ')}
								</li>

								{/* Accessibility */}
								<li>
									<span className='font-semibold'>Accessibility: </span>
									{itinerary.accessibility}
								</li>

								{/* Pickup and Dropoff Locations */}
								<li>
									<span className='font-semibold'>Pickup Location: </span>
									{itinerary.pickupLocation}
								</li>
								<li>
									<span className='font-semibold'>Dropoff Location: </span>
									{itinerary.dropoffLocation}
								</li>
							</ul>
							<button
								onClick={() => handleBookItinerary(itinerary)}
								className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-green-700'>
								Book A Ticket
							</button>
							<button
								onClick={() => handleShareItinerary(itinerary)}
								className='bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700'>
								Share
							</button>
						</div>
					</div>
				))
			) : (
				<p className='text-center text-gray-500 col-span-full'>
					No itineraries available.
				</p>
			)}
		</div>
	);
};

export default ItinerariesCard;
