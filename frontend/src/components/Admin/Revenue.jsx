/** @format */

import React, { useState } from 'react';
import ActivityRevenue from '../Advertiser/ActivityRevenue';
import ItineraryRevenue from '../TourGuide/ItineraryRevenue';
import AttractionRevenue from '../TourismGovernor/AttractionRevenue';
import ProductRevenue from '../Seller/ProductRevenue';

const Revenue = () => {
	const [selectedRevenue, setSelectedRevenue] = useState('select'); // Default to 'select'

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
		<div className='min-h-screen bg-gray-50 py-10 px-4'>
			<div className='max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8'>
				<h1 className='text-3xl font-semibold text-gray-800 text-center mb-6'>
					Admin Dashboard
				</h1>

				{/* Dropdown to select revenue type */}
				<div className='flex flex-col items-center mb-6'>
					<label
						htmlFor='revenueSelect'
						className='text-xl font-medium text-gray-700 mb-2'>
						Select Revenue Type:
					</label>
					<select
						id='revenueSelect'
						value={selectedRevenue}
						onChange={handleSelectChange}
						className='w-full md:w-1/2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300'>
						<option value='select'>Select Revenue</option>
						<option value='activity'>Activity Revenue</option>
						<option value='itinerary'>Itinerary Revenue</option>
						<option value='attraction'>Attraction Revenue</option>
						<option value='product'>Product Revenue</option>
					</select>
				</div>

				{/* Render the selected component */}
				<div className='bg-gray-100 p-6 rounded-lg shadow-inner'>
					{renderSelectedComponent()}
				</div>
			</div>
		</div>
	);
};

export default Revenue;
