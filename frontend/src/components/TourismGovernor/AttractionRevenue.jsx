/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttractionRevenue = () => {
	const [revenue, setRevenue] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Fetch revenue data when the component mounts
	useEffect(() => {
		fetchRevenue();
	}, []);

	const fetchRevenue = async () => {
		setLoading(true);
		setError('');
		setRevenue(null);

		try {
			const endpoint = 'http://localhost:3000/attractions/revenue';
			const response = await axios.get(endpoint);
			setRevenue(response.data); // Assuming response.data contains the revenue data
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch revenue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				padding: '20px',
				maxWidth: '800px',
				margin: 'auto',
				backgroundColor: '#f9f9f9',
				borderRadius: '8px',
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
			}}>
			<h2
				style={{
					textAlign: 'center',
					color: '#333',
					fontSize: '2rem',
					marginBottom: '20px',
				}}>
				Attraction Revenue Dashboard
			</h2>

			{/* Show loading state */}
			{loading && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100px',
					}}>
					<p style={{ fontSize: '1.2rem', color: '#007bff' }}>Loading...</p>
				</div>
			)}

			{/* Show error message */}
			{error && (
				<div
					style={{
						padding: '10px',
						backgroundColor: '#f8d7da',
						color: '#721c24',
						borderRadius: '4px',
						marginBottom: '20px',
					}}>
					<p>{error}</p>
				</div>
			)}

			{/* Show total revenue and attraction details */}
			{revenue && (
				<div>
					{/* Display total revenue */}
					<div
						style={{
							padding: '20px',
							backgroundColor: '#e9f7fd',
							borderRadius: '8px',
							boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
							marginBottom: '30px',
						}}>
						<h3 style={{ textAlign: 'center', color: '#0056b3' }}>
							Total Revenue
						</h3>
						<p style={{ fontSize: '1.5rem', textAlign: 'center' }}>
							<strong>${revenue.totalRevenue}</strong>
						</p>
					</div>

					{/* Display attractions with revenue */}
					<h4
						style={{
							color: '#333',
							marginBottom: '10px',
							fontSize: '1.3rem',
							textAlign: 'center',
						}}>
						Attractions Overview
					</h4>
					<ul
						style={{
							listStyleType: 'none',
							padding: 0,
							margin: 0,
							borderTop: '1px solid #ddd',
						}}>
						{revenue.attractions.map((attraction) => (
							<li
								key={attraction.id}
								style={{
									padding: '15px',
									borderBottom: '1px solid #ddd',
									backgroundColor: '#fff',
									borderRadius: '4px',
									marginBottom: '10px',
								}}>
								<h5 style={{ color: '#007bff', fontSize: '1.1rem' }}>
									{attraction.name}
								</h5>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}>
									<p>
										<strong>Price (Native):</strong> $
										{attraction.ticketPrices.native}
									</p>
									<p>
										<strong>Price (Foreigner):</strong> $
										{attraction.ticketPrices.foreigner}
									</p>
									<p>
										<strong>Price (Student):</strong> $
										{attraction.ticketPrices.student}
									</p>
								</div>
								<p>
									<strong>Status:</strong>{' '}
									<span
										style={{
											color: attraction.isBooked ? '#28a745' : '#dc3545',
										}}>
										{attraction.isBooked ? 'Booked' : 'Not Booked'}
									</span>
								</p>
								<p>
									<strong>Revenue:</strong> ${attraction.revenue}
								</p>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Button to manually refresh data */}
			<div style={{ textAlign: 'center', marginTop: '20px' }}>
				<button
					onClick={fetchRevenue}
					style={{
						padding: '10px 20px',
						backgroundColor: '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
						fontSize: '1rem',
					}}
					disabled={loading}>
					{loading ? 'Fetching...' : 'Refresh Revenue Data'}
				</button>
			</div>
		</div>
	);
};

export default AttractionRevenue;
