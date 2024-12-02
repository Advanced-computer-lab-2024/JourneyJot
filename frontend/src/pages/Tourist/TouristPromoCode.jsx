/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromoCodesPage = () => {
	const [promoCodes, setPromoCodes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchPromoCodes = async () => {
			try {
				// Get the token from localStorage (ensure the token is available)
				const token = localStorage.getItem('token');

				// Check if the token exists
				if (!token) {
					setError('No token found. Please login.');
					setLoading(false);
					return;
				}

				// Define headers with the Authorization token
				const config = {
					headers: {
						Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
					},
				};

				// Make the GET request to the backend to fetch promo codes
				const response = await axios.get(
					'http://localhost:3000/tourists/promoCodes',
					config
				);

				// Set the response data (promo codes) into the state
				setPromoCodes(response.data.promoCodes);
			} catch (error) {
				// Handle errors and set an error message
				setError(
					error.response?.data?.message || 'Failed to fetch promo codes'
				);
			} finally {
				setLoading(false); // Ensure loading is set to false after the request completes
			}
		};
		fetchPromoCodes();
	}, []);

	if (loading) return <div>Loading promo codes...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div style={styles.container}>
			<h2>Your Promo Codes</h2>
			{promoCodes.length === 0 ? (
				<p>No promo codes available</p>
			) : (
				<ul style={styles.list}>
					{promoCodes.map((promo) => (
						<li
							key={promo._id}
							style={styles.listItem}>
							<div>
								<strong>Code:</strong> {promo.code}
							</div>
							<div>
								<strong>Discount:</strong> {promo.discount}%
							</div>
							<div>
								<strong>Expires:</strong>{' '}
								{new Date(promo.expirationDate).toLocaleDateString()}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

const styles = {
	container: {
		maxWidth: '600px',
		margin: '20px auto',
		padding: '20px',
		border: '1px solid #ccc',
		borderRadius: '8px',
		backgroundColor: '#f9f9f9',
		boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
	},
	list: {
		listStyleType: 'none',
		paddingLeft: '0',
	},
	listItem: {
		padding: '15px',
		marginBottom: '10px',
		border: '1px solid #ccc',
		borderRadius: '4px',
		backgroundColor: '#fff',
	},
};

export default PromoCodesPage;
