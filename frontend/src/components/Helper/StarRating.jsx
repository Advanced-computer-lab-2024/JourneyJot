/** @format */

const StarRating = ({ rating }) => {
	const fullStars = Math.floor(rating);
	const emptyStars = 5 - fullStars;

	return (
		<div className='flex space-x-1'>
			{[...Array(fullStars)].map((_, index) => (
				<svg
					key={`full-${index}`}
					xmlns='http://www.w3.org/2000/svg'
					className='w-5 h-5 text-yellow-500'
					fill='currentColor'
					viewBox='0 0 20 20'>
					<path d='M10 15.27l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L10 3 7.19 8.82 2 9.24l3.46 3.67-1.64 5.09L10 15.27z' />
				</svg>
			))}
			{[...Array(emptyStars)].map((_, index) => (
				<svg
					key={`empty-${index}`}
					xmlns='http://www.w3.org/2000/svg'
					className='w-5 h-5 text-gray-300'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						fill='none'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M12 17.75l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L12 3l-2.81 5.82-5.19.42L7.46 15.42 3 18.15 12 17.75z'
					/>
				</svg>
			))}
		</div>
	);
};

export default StarRating;
