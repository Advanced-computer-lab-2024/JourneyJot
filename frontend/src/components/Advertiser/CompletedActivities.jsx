/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompletedActivities = () => {
	const [distinctTouristCount, setDistinctTouristCount] = useState(0);
	const [distinctTourists, setDistinctTourists] = useState([]); // Tourist usernames
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Replace with your API base URL
	const API_URL = 'http://localhost:3000/tourists/completedActivities';

	// Fetch distinct tourist count and usernames
	const fetchTouristData = async () => {
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem('token'); // Retrieve token from localStorage
			const response = await axios.get(API_URL, {
				headers: {
					Authorization: `Bearer ${token}`, // Pass token in the Authorization header
				},
			});

			setDistinctTouristCount(response.data.distinctTouristCount);
			setDistinctTourists(response.data.distinctTourists); // Set the usernames
		} catch (err) {
			setError(
				err.response ? err.response.data.message : 'Error fetching data'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTouristData();
	}, []);

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
			<div className='bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full'>
				<h1 className='text-3xl font-bold text-gray-800 text-center mb-6'>
					Report: Completed Activities
				</h1>

				{loading ? (
					<p className='text-center text-blue-500 mt-4'>Loading...</p>
				) : error ? (
					<p className='text-center text-red-500 mt-4'>{error}</p>
				) : (
					<div>
						{/* Section: Overview */}
						<div className='mb-6'>
							<h2 className='text-xl font-semibold text-gray-700'>Overview</h2>
							<p className='mt-2 text-gray-600'>
								Total number of distinct tourists who have completed activities:
							</p>
							<p className='text-4xl font-bold text-blue-600 mt-2'>
								{distinctTouristCount}
							</p>
						</div>

						{/* Section: Tourist Details */}
						{distinctTourists.length > 0 && (
							<div className='mt-6'>
								<h2 className='text-xl font-semibold text-gray-700'>
									Tourist Details
								</h2>
								<table className='w-full mt-4 border-collapse border border-gray-200'>
									<thead>
										<tr className='bg-gray-100'>
											<th className='border border-gray-300 px-4 py-2 text-left text-gray-600 font-medium'>
												#
											</th>
											<th className='border border-gray-300 px-4 py-2 text-left text-gray-600 font-medium'>
												Tourist Username
											</th>
										</tr>
									</thead>
									<tbody>
										{distinctTourists.map((tourist, index) => (
											<tr
												key={tourist.id}
												className='odd:bg-white even:bg-gray-50'>
												<td className='border border-gray-300 px-4 py-2 text-gray-700'>
													{index + 1}
												</td>
												<td className='border border-gray-300 px-4 py-2 text-gray-700'>
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

export default CompletedActivities;
