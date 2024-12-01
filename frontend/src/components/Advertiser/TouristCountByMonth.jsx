/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TouristCountByMonth = () => {
	const [touristCountByMonth, setTouristCountByMonth] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedMonth, setSelectedMonth] = useState(''); // User-selected month

	const API_URL =
		'http://localhost:3000/tourists/touristCountByMonthForItinerary'; // Adjust the endpoint as necessary

	const fetchTouristData = async (month) => {
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(API_URL, {
				headers: { Authorization: `Bearer ${token}` },
				params: { month: month }, // Pass selected month as query parameter
			});

			setTouristCountByMonth(response.data.touristCountByMonth);
		} catch (err) {
			setError('Error fetching data');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (selectedMonth) {
			fetchTouristData(selectedMonth);
		}
	}, [selectedMonth]);

	return (
		<div>
			<h1>Tourists by Month</h1>
			<select onChange={(e) => setSelectedMonth(e.target.value)}>
				<option value=''>Select a month</option>
				{/* Add more options here for month selection */}
				<option value='1-2024'>January 2024</option>
				<option value='2-2024'>February 2024</option>
				<option value='3-2024'>March 2024</option>
				{/* Add more months as needed */}
			</select>

			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<div>
					<h2>Tourist Count by Month</h2>
					<ul>
						{Object.entries(touristCountByMonth).map(([month, count]) => (
							<li key={month}>
								{month}: {count} tourists
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default TouristCountByMonth;
