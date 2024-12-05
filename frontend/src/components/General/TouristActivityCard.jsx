/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import StarRating from '../Helper/StarRating';

const ActivitiesCard = ({ activities = [], currency, conversionRate = 1 }) => {
	return (
		<div className='flex flex-wrap justify-center gap-6'>
			{activities.length > 0 ? (
				activities.map((activity) => (
					<div
						key={activity._id}
						className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-80 hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700'>
						{/* Activity Image */}
						{activity.imageUrl && (
							<img
								src={activity.imageUrl}
								alt={activity.name}
								className='w-full h-40 object-cover rounded-t-lg'
								loading='lazy'
							/>
						)}

						{/* Activity Details */}
						<div className='p-4 space-y-3'>
							<h2 className='text-xl font-semibold text-blue-900 dark:text-blue-300 truncate'>
								{activity.name || 'Activity Name'}
							</h2>
							<div className='flex items-center text-gray-700 dark:text-gray-300 text-sm'>
								<span className='font-medium'>Advertiser:</span>
								<span className='ml-1'>
									{activity.advertiserId?.username || 'N/A'}
								</span>
							</div>
							<div className='flex items-center text-gray-700 dark:text-gray-300 text-sm'>
								<span className='font-medium'>Date:</span>
								<span className='ml-1'>
									{new Date(activity.date).toLocaleDateString()}
								</span>
							</div>
							<div className='flex items-center text-gray-700 dark:text-gray-300 text-sm'>
								<span className='font-medium'>Time:</span>
								<span className='ml-1'>{activity.time || 'N/A'}</span>
							</div>
							<div className='flex items-center text-gray-700 dark:text-gray-300 text-sm'>
								<span className='font-medium'>Price:</span>
								<span className='ml-1'>
									{activity.price
										? (activity.price * conversionRate).toFixed(2)
										: 'N/A'}{' '}
									<span className='font-semibold'>{currency}</span>
								</span>
							</div>
							<div className='flex items-center text-gray-700 dark:text-gray-300 text-sm'>
								<span className='font-medium'>Category:</span>
								<span className='ml-1'>{activity.category?.name || 'N/A'}</span>
							</div>
							<div className='flex items-center text-gray-700 dark:text-gray-300 text-sm'>
								<span className='font-medium'>Tag:</span>
								<span className='ml-1'>
									{activity.preferenceTag?.name || 'N/A'}
								</span>
							</div>
							<div className='flex items-center text-gray-700 dark:text-gray-300 text-sm'>
								<span className='font-medium'>Discounts:</span>
								<span className='ml-1'>
									{activity.specialDiscounts || 'N/A'}
								</span>
							</div>
							<div className='flex items-center text-gray-700 dark:text-gray-300 text-sm'>
								<span className='font-medium'>Status:</span>
								<span className='ml-1'>
									{activity.bookingOpen ? (
										<span className='text-green-600 font-semibold'>Open</span>
									) : (
										<span className='text-red-600 font-semibold'>Closed</span>
									)}
								</span>
							</div>
							{/* Star Rating */}
							<div className='flex items-center'>
								<StarRating rating={activity.rating || 0} />
								<span className='ml-2 text-gray-700 dark:text-gray-300 text-sm'>
									({activity.num_reviews || 0})
								</span>
							</div>
						</div>
					</div>
				))
			) : (
				<p className='text-center text-gray-600 dark:text-gray-400'>
					No activities available.
				</p>
			)}
		</div>
	);
};

ActivitiesCard.propTypes = {
	activities: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string,
			advertiserId: PropTypes.shape({
				username: PropTypes.string,
			}),
			date: PropTypes.string,
			time: PropTypes.string,
			price: PropTypes.number,
			category: PropTypes.shape({
				name: PropTypes.string,
			}),
			preferenceTag: PropTypes.shape({
				name: PropTypes.string,
			}),
			specialDiscounts: PropTypes.string,
			bookingOpen: PropTypes.bool,
			rating: PropTypes.number,
			num_reviews: PropTypes.number,
			imageUrl: PropTypes.string,
		})
	).isRequired,
	currency: PropTypes.string.isRequired,
	conversionRate: PropTypes.number,
};

export default ActivitiesCard;
