/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import StarRating from '../Helper/StarRating'; // Ensure this component exists and is correctly implemented

const ItinerariesCard = ({
	itineraries = [],
	currency = 'USD', // Default currency
	conversionRate = 1,
}) => {
	// Basic validation for currency code length (ISO 4217 codes are 3 letters)
	const isValidCurrency = typeof currency === 'string' && currency.length === 3;

	// Function to format price
	const formattedPrice = (price) => {
		if (typeof price !== 'number') return 'N/A';
		if (!isValidCurrency) {
			console.error(`Invalid currency code: ${currency}`);
			return `${price.toFixed(2)} N/A`;
		}
		try {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: currency,
			}).format(price * conversionRate);
		} catch (err) {
			console.error(`Error formatting price with currency ${currency}:`, err);
			return `${price.toFixed(2)} N/A`;
		}
	};

	return (
		<div className='flex flex-wrap justify-center gap-6 p-4'>
			{itineraries && itineraries.length > 0 ? (
				itineraries.map((itinerary) => (
					<div
						key={itinerary._id}
						className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-80 hover:shadow-lg transition-shadow duration-300'>
						{/* Itinerary Details */}
						<div className='p-4 space-y-2'>
							<h2 className='text-xl font-semibold text-blue-900 dark:text-blue-300 truncate'>
								{itinerary.name || 'Itinerary Name'}
							</h2>
							<ul className='space-y-1 text-gray-700 dark:text-gray-400 text-sm'>
								<li>
									<span className='font-medium'>Tour Guide:</span>{' '}
									{itinerary.tourGuideId?.username || 'Unknown'}
								</li>
								<li>
									<span className='font-medium'>Activities:</span>{' '}
									{Array.isArray(itinerary.activities) &&
									itinerary.activities.length > 0
										? itinerary.activities.join(', ')
										: 'N/A'}
								</li>
								<li>
									<span className='font-medium'>Locations:</span>{' '}
									{Array.isArray(itinerary.locations) &&
									itinerary.locations.length > 0
										? itinerary.locations.join(', ')
										: 'N/A'}
								</li>
								<li>
									<span className='font-medium'>Price:</span>{' '}
									{formattedPrice(itinerary.price)}{' '}
									{isValidCurrency ? currency : ''}
								</li>
								<li>
									<span className='font-medium'>Available Dates:</span>{' '}
									{Array.isArray(itinerary.availableDates) &&
									itinerary.availableDates.length > 0
										? itinerary.availableDates
												.map((date) => {
													const parsedDate = new Date(date);
													return isNaN(parsedDate)
														? 'Invalid Date'
														: parsedDate.toLocaleDateString();
												})
												.join(', ')
										: 'N/A'}
								</li>
								<li>
									<span className='font-medium'>Rating:</span>{' '}
									<StarRating
										rating={
											typeof itinerary.rating === 'number'
												? itinerary.rating
												: 0
										}
									/>
								</li>
								<li>
									<span className='font-medium'>Booking Status:</span>{' '}
									{typeof itinerary.bookingOpen === 'boolean' ? (
										itinerary.bookingOpen ? (
											<span className='text-green-500'>Open</span>
										) : (
											<span className='text-red-500'>Closed</span>
										)
									) : (
										'N/A'
									)}
								</li>
							</ul>
						</div>
					</div>
				))
			) : (
				<p className='text-center text-gray-500 dark:text-gray-400 w-full'>
					No itineraries available.
				</p>
			)}
		</div>
	);
};

ItinerariesCard.propTypes = {
	itineraries: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string,
			tourGuideId: PropTypes.shape({
				username: PropTypes.string,
			}),
			activities: PropTypes.arrayOf(PropTypes.string),
			locations: PropTypes.arrayOf(PropTypes.string),
			price: PropTypes.number,
			availableDates: PropTypes.arrayOf(PropTypes.string),
			rating: PropTypes.number,
			bookingOpen: PropTypes.bool,
			imageUrl: PropTypes.string,
		})
	).isRequired,
	currency: PropTypes.string,
	conversionRate: PropTypes.number,
};

ItinerariesCard.defaultProps = {
	currency: 'USD', // Default currency
	conversionRate: 1,
};

export default ItinerariesCard;
