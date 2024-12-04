/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompletedItineraries = () => {
	const [distinctTouristCount, setDistinctTouristCount] = useState(0);
	const [distinctTourists, setDistinctTourists] = useState([]);
	const [totalTouristCount, setTotalTouristCount] = useState(0);
	const [totalDistinctTourists, setTotalDistinctTourists] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [month, setMonth] = useState('');
	const [year, setYear] = useState('');

	// API URLs
	const BASE_API_URL = 'http://localhost:3000/tourists';
	const ALL_TOURISTS_API_URL = `${BASE_API_URL}/completedItineraries`;
	const FILTERED_API_URL = `${BASE_API_URL}/completedItinerariesAndTourists`;

	const fetchAllTouristsData = async () => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(ALL_TOURISTS_API_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setTotalTouristCount(response.data.totalTouristCount);
			setTotalDistinctTourists(response.data.distinctTourists);
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Error fetching data'
			);
		} finally {
			setLoading(false);
		}
	};

	const fetchTouristData = async () => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(FILTERED_API_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: { month, year },
			});
			setDistinctTouristCount(response.data.distinctTouristCount);
			setDistinctTourists(response.data.distinctTourists);
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Error fetching data'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllTouristsData();
	}, []);

	useEffect(() => {
		if (month && year) {
			fetchTouristData();
		}
	}, [month, year]);

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-8 flex items-center justify-center'>
			<div className='bg-white shadow-lg rounded-lg p-6 max-w-5xl w-full'>
				<h1 className='text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8'>
					Completed Itineraries Report
				</h1>

				{/* Filters Section */}
				<div className='mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6'>
					<div>
						<label className='block text-gray-700 font-medium mb-2'>
							Select Month
						</label>
						<select
							className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300'
							value={month}
							onChange={(e) => setMonth(e.target.value)}>
							<option value=''>-- Select Month --</option>
							{Array.from({ length: 12 }, (_, i) => (
								<option
									key={i + 1}
									value={i + 1}>
									{new Date(0, i).toLocaleString('default', { month: 'long' })}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className='block text-gray-700 font-medium mb-2'>
							Select Year
						</label>
						<input
							type='number'
							className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300'
							placeholder='Enter Year'
							value={year}
							onChange={(e) => setYear(e.target.value)}
						/>
					</div>
				</div>

				{/* Loading, Error, or Results */}
				{loading ? (
					<p className='text-center text-blue-500 text-lg'>Loading...</p>
				) : error ? (
					<p className='text-center text-red-500 text-lg'>{error}</p>
				) : (
					<div>
						{/* Overview Section */}
						<div className='mb-8'>
							<h2 className='text-xl font-semibold text-gray-700'>Overview</h2>
							<div className='mt-4 space-y-4'>
								<p className='text-gray-600'>
									Total tourists who completed itineraries:
								</p>
								<p className='text-3xl font-bold text-green-500'>
									{totalTouristCount}
								</p>
								<p className='text-gray-600'>Total distinct tourists:</p>
								<p className='text-3xl font-bold text-blue-500'>
									{totalDistinctTourists.length}
								</p>
								{month && year && (
									<>
										<p className='text-gray-600'>
											Distinct tourists for {month}/{year}:
										</p>
										<p className='text-3xl font-bold text-purple-500'>
											{distinctTouristCount}
										</p>
									</>
								)}
							</div>
						</div>

						{/* Tourist Details Section */}
						{(distinctTourists.length > 0 ||
							totalDistinctTourists.length > 0) && (
							<div className='overflow-x-auto'>
								<h2 className='text-xl font-semibold text-gray-700 mb-4'>
									Tourist Details
								</h2>
								<table className='w-full border border-gray-200 rounded-lg overflow-hidden'>
									<thead>
										<tr className='bg-gray-100'>
											<th className='px-4 py-3 text-left text-gray-700 font-medium'>
												#
											</th>
											<th className='px-4 py-3 text-left text-gray-700 font-medium'>
												Tourist Username
											</th>
										</tr>
									</thead>
									<tbody>
										{(month && year
											? distinctTourists
											: totalDistinctTourists
										).map((tourist, index) => (
											<tr
												key={tourist.id}
												className='odd:bg-white even:bg-gray-50'>
												<td className='px-4 py-2 text-gray-700'>{index + 1}</td>
												<td className='px-4 py-2 text-gray-700'>
													{tourist.username}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default CompletedItineraries;
