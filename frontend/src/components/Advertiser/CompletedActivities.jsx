/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompletedActivities = () => {
	const navigate = useNavigate();
	const [distinctTouristCount, setDistinctTouristCount] = useState(0);
	const [allDistinctTouristCount, setAllDistinctTouristCount] = useState(0);
	const [distinctTourists, setDistinctTourists] = useState([]);
	const [month, setMonth] = useState('');
	const [year, setYear] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	
	const FILTERED_API_URL =
		'http://localhost:3000/tourists/completedActivitiesAndTourists';
	const ALL_API_URL = 'http://localhost:3000/tourists/completedActivities';

	const fetchAllDistinctTourists = async () => {
		setError(null);

		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(ALL_API_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setAllDistinctTouristCount(response.data.distinctTouristCount);
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Error fetching all data'
			);
		}
	};

	const fetchFilteredTouristData = async () => {
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
				err.response
					? err.response.data.message
					: 'Error fetching filtered data'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllDistinctTourists();
	}, []);

	useEffect(() => {
		if (month && year) {
			fetchFilteredTouristData();
		}
	}, [month, year]);

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300   flex items-center justify-center'>
			<div className='bg-white shadow-md rounded-lg p-6 max-w-4xl w-full'>
			<button
          onClick={() => navigate(-1)}
          className="text-gray-700 text-xl mb-4 flex items-center hover:text-gray-900 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
				<h1 className='text-2xl font-bold text-gray-800 text-center mb-6'>
					Completed Activities Report
				</h1>

				{/* Overview Section */}
				<section className='mb-6'>
					<h2 className='text-lg font-medium text-gray-700'>Overview</h2>
					<p className='text-sm text-gray-500 mt-1'>
						Total number of distinct tourists who completed activities (all
						time):
					</p>
					<p className='text-3xl font-semibold text-green-500 mt-2'>
						{allDistinctTouristCount}
					</p>
				</section>

				{/* Filter Section */}
				<section className='mb-6'>
					<h2 className='text-lg font-medium text-gray-700'>Filter by Date</h2>
					<div className='mt-4 flex flex-wrap gap-4'>
						{/* Month Input */}
						<div className='flex flex-col'>
							<label
								htmlFor='month'
								className='text-sm text-gray-600 mb-1'>
								Month
							</label>
							<select
								id='month'
								value={month}
								onChange={(e) => setMonth(e.target.value)}
								className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'>
								<option value=''>Select Month</option>
								{Array.from({ length: 12 }, (_, i) => (
									<option
										key={i + 1}
										value={i + 1}>
										{i + 1}
									</option>
								))}
							</select>
						</div>

						{/* Year Input */}
						<div className='flex flex-col'>
							<label
								htmlFor='year'
								className='text-sm text-gray-600 mb-1'>
								Year
							</label>
							<input
								id='year'
								type='number'
								placeholder='e.g., 2024'
								value={year}
								onChange={(e) => setYear(e.target.value)}
								className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
							/>
						</div>

						{/* Apply Filter Button */}
						<div className='flex items-end'>
							<button
								onClick={fetchFilteredTouristData}
								className='bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'>
								Apply Filter
							</button>
						</div>
					</div>
				</section>

				{/* Loading and Error States */}
				{loading ? (
					<p className='text-center text-blue-500 mt-4'>Loading...</p>
				) : error ? (
					<p className='text-center text-red-500 mt-4'>{error}</p>
				) : (
					<div>
						{/* Filtered Overview */}
						<section className='mb-6'>
							<h2 className='text-lg font-medium text-gray-700'>
								Filtered Results
							</h2>
							<p className='text-sm text-gray-500 mt-1'>
								Total number of distinct tourists (filtered by date):
							</p>
							<p className='text-3xl font-semibold text-blue-500 mt-2'>
								{distinctTouristCount}
							</p>
						</section>

						{/* Section: Tourist Details */}
						{distinctTourists.length > 0 && (
							<section>
								<h2 className='text-lg font-medium text-gray-700 mb-4'>
									Tourist Details
								</h2>
								<table className='w-full text-sm border border-gray-200'>
									<thead>
										<tr className='bg-gray-100'>
											<th className='text-left px-4 py-2 border border-gray-300'>
												#
											</th>
											<th className='text-left px-4 py-2 border border-gray-300'>
												Tourist Username
											</th>
										</tr>
									</thead>
									<tbody>
										{distinctTourists.map((tourist, index) => (
											<tr
												key={tourist.id}
												className='odd:bg-white even:bg-gray-50'>
												<td className='px-4 py-2 border border-gray-300'>
													{index + 1}
												</td>
												<td className='px-4 py-2 border border-gray-300'>
													{tourist.username}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</section>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default CompletedActivities;
