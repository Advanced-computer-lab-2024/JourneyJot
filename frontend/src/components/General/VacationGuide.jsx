/** @format */

// src/components/VacationGuide.jsx

import React from 'react';
import {
	FaSearch,
	FaHotel,
	FaCreditCard,
	FaMapMarkedAlt,
	FaSmile,
} from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations
import { useNavigate } from 'react-router-dom';

const VacationGuide = () => {
	// Define the steps of the vacation booking process with unique IDs
	const navigate = useNavigate();
	const steps = [
		{
			id: 1,
			title: 'Search Destinations',
			description:
				'Use our search bar to find your ideal vacation spot. Enter your desired location, travel dates, and preferences to get started.',
			icon: <FaSearch size={24} />,
		},
		{
			id: 2,
			title: 'Select Accommodations',
			description:
				'Browse through a wide range of accommodations. Filter results based on your budget, amenities, and other preferences to find the perfect stay.',
			icon: <FaHotel size={24} />,
		},
		{
			id: 3,
			title: 'Book Your Stay',
			description:
				'Once you’ve selected your accommodation, proceed to booking. Enter your details and confirm your reservation securely.',
			icon: <FaCreditCard size={24} />,
		},
		{
			id: 4,
			title: 'Plan Your Itinerary',
			description:
				'Explore activities and attractions in your chosen destination. Customize your itinerary to make the most out of your vacation.',
			icon: <FaMapMarkedAlt size={24} />,
		},
		{
			id: 5,
			title: 'Enjoy Your Vacation',
			description:
				'With everything booked and planned, all that’s left is to relax and enjoy your well-deserved vacation!',
			icon: <FaSmile size={24} />,
		},
	];

	return (
		<section className='py-16 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 '>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Header */}
				<div className='text-center mb-12'>
					<button
						onClick={() => navigate(-1)}
						className='text-gray-700 text-xl mb-4 flex items-center hover:text-gray-900 transition'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-6 w-6 mr-2'
							fill='none'
							viewBox='0 0 24 24'
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
					<h2 className='text-base text-indigo-600 font-semibold tracking-wide uppercase'>
						JourneyJot Guide
					</h2>
					<p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
						Start Your Perfect Vacation in 5 Easy Steps
					</p>
					<p className='mt-4 max-w-2xl text-xl text-gray-500 mx-auto'>
						Follow this step-by-step guide to plan and book your dream vacation
						effortlessly.
					</p>
				</div>

				{/* Timeline */}
				<ol className='relative border-l border-gray-200'>
					{steps.map((step, index) => (
						<motion.li
							key={step.id}
							className='mb-10 ml-6'
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: index * 0.2 }}>
							{/* Step Icon */}
							<span className='flex absolute -left-3 justify-center items-center w-6 h-6 bg-indigo-500 rounded-full ring-8 ring-gray-100'>
								{step.icon}
							</span>

							{/* Step Content */}
							<div className='bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
								{/* Step Title */}
								<h3 className='flex items-center mb-2 text-xl font-semibold text-gray-900'>
									<span className='text-indigo-600 mr-2'>{index + 1}.</span>
									{step.title}
								</h3>

								{/* Step Description */}
								<p className='text-gray-600'>{step.description}</p>
							</div>
						</motion.li>
					))}
				</ol>

				{/* Call to Action */}
				<div className='mt-12 text-center'>
					<button
						onClick={() =>
							window.scrollTo({
								top: document.body.scrollHeight,
								behavior: 'smooth',
							})
						}
						className='inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-200'
						aria-label='Start Booking Now'>
						<FaSmile className='mr-2' /> Start Booking Now
					</button>
				</div>
			</div>
		</section>
	);
};

// Optional: Define PropTypes if you plan to pass props in the future
// VacationGuide.propTypes = {};

export default VacationGuide;
