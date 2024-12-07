/** @format */

import React, { useState } from 'react';
import ActivityRevenue from '../Advertiser/ActivityRevenue';
import ItineraryRevenue from '../TourGuide/ItineraryRevenue';
import AttractionRevenue from '../TourismGovernor/AttractionRevenue';
import ProductRevenue from '../Seller/ProductRevenue';
import { useNavigate } from 'react-router-dom';

const Revenue = () => {
	const [selectedRevenue, setSelectedRevenue] = useState('select'); // Default to 'select'
	const navigate = useNavigate();

	// Function to handle dropdown change
	const handleSelectChange = (e) => {
		setSelectedRevenue(e.target.value);
	};

	// Function to render the selected component
	const renderSelectedComponent = () => {
		switch (selectedRevenue) {
			case 'select':
				return (
					<p className='text-gray-600 text-center'>
						Please select a revenue type to display details.
					</p>
				);
			case 'activity':
				return <ActivityRevenue />;
			case 'itinerary':
				return <ItineraryRevenue />;
			case 'attraction':
				return <AttractionRevenue />;
			case 'product':
				return <ProductRevenue />;
			default:
				return (
					<p className='text-red-500 text-center'>
						Invalid selection. Please choose a valid revenue type.
					</p>
				);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-10'>
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
				<h1 className='text-3xl font-semibold text-gray-800 text-center mb-8'>
					Admin Dashboard
				</h1>

				{/* Dropdown to select revenue type */}
				<div className='flex flex-col items-center mb-8'>
					<label
						htmlFor='revenueSelect'
						className='text-xl font-medium text-gray-700 mb-3'>
						Select Revenue Type:
					</label>
					<select
						id='revenueSelect'
						value={selectedRevenue}
						onChange={handleSelectChange}
						className='w-full md:w-1/2 bg-white border border-gray-300 text-gray-800 rounded-lg shadow-md px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300'>
						<option
							value='select'
							className='text-gray-500'>
							Select Revenue
						</option>
						<option value='activity'>Activity Revenue</option>
						<option value='itinerary'>Itinerary Revenue</option>
						<option value='attraction'>Attraction Revenue</option>
						<option value='product'>Product Revenue</option>
					</select>
				</div>

				{/* Render the selected component */}
				<div className='bg-gray-50 p-8 rounded-lg shadow-inner'>
					{renderSelectedComponent()}
				</div>
			</div>
		</div>
	);
};

export default Revenue;
