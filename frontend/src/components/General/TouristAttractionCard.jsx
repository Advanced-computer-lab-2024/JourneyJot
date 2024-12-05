/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import StarRating from '../Helper/StarRating'; // Ensure this component exists and is correctly implemented

const AttractionsCard = ({
	attractions = [],
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
			{attractions && attractions.length > 0 ? (
				attractions.map((attraction) => (
					<div
						key={attraction._id}
						className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-80 hover:shadow-lg transition-shadow duration-300'>
						{/* Attraction Image */}

						{/* Attraction Details */}
						<div className='p-4 space-y-2'>
							<h2 className='text-xl font-semibold text-blue-900 dark:text-blue-300 truncate'>
								{attraction.name || 'Attraction Name'}
							</h2>
							<ul className='space-y-1 text-gray-700 dark:text-gray-400 text-sm'>
								<li>
									<span className='font-medium'>Governor:</span>{' '}
									{attraction.governorId?.username || 'N/A'}
								</li>
								<li>
									<span className='font-medium'>Description:</span>{' '}
									{attraction.description || 'Not available'}
								</li>
								<li>
									<span className='font-medium'>Location:</span>{' '}
									{attraction.location || 'Not specified'}
								</li>
								<li>
									<span className='font-medium'>Opening Hours:</span>{' '}
									{attraction.openingHours || 'Not available'}
								</li>
								<li>
									<span className='font-medium'>Ticket Prices:</span>
									{attraction.ticketPrices ? (
										<ul className='pl-6 space-y-1'>
											<li>
												Natives:{' '}
												{formattedPrice(attraction.ticketPrices.native)}{' '}
												{isValidCurrency ? currency : ''}
											</li>
											<li>
												Foreigners:{' '}
												{formattedPrice(attraction.ticketPrices.foreigner)}{' '}
												{isValidCurrency ? currency : ''}
											</li>
											<li>
												Students:{' '}
												{formattedPrice(attraction.ticketPrices.student)}{' '}
												{isValidCurrency ? currency : ''}
											</li>
										</ul>
									) : (
										' Not available'
									)}
								</li>
								{attraction.tags?.length > 0 && (
									<li>
										<span className='font-medium'>Tags:</span>{' '}
										{attraction.tags.join(', ')}
									</li>
								)}
							</ul>

							{/* Star Rating */}
							<div className='flex items-center'>
								<StarRating
									rating={
										typeof attraction.rating === 'number'
											? attraction.rating
											: 0
									}
								/>
								<span className='ml-2 text-gray-600 dark:text-gray-400 text-sm'>
									({attraction.num_reviews || 0})
								</span>
							</div>

							{/* Booking Status */}
							<div className='flex items-center text-gray-600 dark:text-gray-400 text-sm'>
								<span className='font-medium'>Booking Status:</span>{' '}
								{typeof attraction.bookingOpen === 'boolean' ? (
									attraction.bookingOpen ? (
										<span className='text-green-500'>Open</span>
									) : (
										<span className='text-red-500'>Closed</span>
									)
								) : (
									'N/A'
								)}
							</div>
						</div>
					</div>
				))
			) : (
				<p className='text-center text-gray-500 dark:text-gray-400 w-full'>
					No attractions available.
				</p>
			)}
		</div>
	);
};

AttractionsCard.propTypes = {
	attractions: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string,
			governorId: PropTypes.shape({
				username: PropTypes.string,
			}),
			description: PropTypes.string,
			location: PropTypes.string,
			openingHours: PropTypes.string,
			ticketPrices: PropTypes.shape({
				native: PropTypes.number,
				foreigner: PropTypes.number,
				student: PropTypes.number,
			}),
			tags: PropTypes.arrayOf(PropTypes.string),
			rating: PropTypes.number,
			num_reviews: PropTypes.number,
			bookingOpen: PropTypes.bool,
			imageUrl: PropTypes.string,
		})
	).isRequired,
	currency: PropTypes.string,
	conversionRate: PropTypes.number,
};

AttractionsCard.defaultProps = {
	currency: 'USD', // Default currency
	conversionRate: 1,
};

export default AttractionsCard;
