/** @format */

//PromoCodeForm.jsx (ADMIN comp.)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromoCodeForm = () => {
	const [code, setCode] = useState('');
	const [discount, setDiscount] = useState('');
	const [expirationDate, setExpirationDate] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [promoCodes, setPromoCodes] = useState([]);

	// Fetch promo codes
	useEffect(() => {
		const fetchPromoCodes = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(
					'http://localhost:3000/admins/promo-codes',
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setPromoCodes(response.data);
			} catch (error) {
				console.error('Error fetching promo codes:', error);
			}
		};

		fetchPromoCodes();
	}, [successMessage]); // Refresh list when a promo code is added or deleted

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		const promoCodeData = {
			code,
			discount: parseFloat(discount),
			expirationDate,
		};

		try {
			const token = localStorage.getItem('token');
			const response = await axios.post(
				'http://localhost:3000/admins/promo-codes',
				promoCodeData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setSuccessMessage(response.data.message);
			setErrorMessage('');
			setCode('');
			setDiscount('');
			setExpirationDate('');
		} catch (error) {
			setErrorMessage(
				error.response?.data?.message || 'Failed to create promo code'
			);
			setSuccessMessage('');
		}
	};

	// Handle promo code deletion
	const handleDelete = async (promoCodeId) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.delete(
				`http://localhost:3000/admins/promo-codes/${promoCodeId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setSuccessMessage(response.data.message);
			setErrorMessage('');
		} catch (error) {
			setErrorMessage(
				error.response?.data?.message || 'Failed to delete promo code'
			);
		}
	};

	return (
		<div style={styles.container}>
			<h3 style={styles.title}>Create a Promo Code</h3>
			{successMessage && (
				<p style={{ ...styles.message, color: 'green' }}>{successMessage}</p>
			)}
			{errorMessage && (
				<p style={{ ...styles.message, color: 'red' }}>{errorMessage}</p>
			)}
			<form
				onSubmit={handleSubmit}
				style={styles.form}>
				<div style={styles.field}>
					<label style={styles.label}>Code:</label>
					<input
						type='text'
						value={code}
						onChange={(e) => setCode(e.target.value)}
						style={styles.input}
						required
					/>
				</div>
				<div style={styles.field}>
					<label style={styles.label}>Discount (% or flat):</label>
					<input
						type='number'
						value={discount}
						onChange={(e) => setDiscount(e.target.value)}
						style={styles.input}
						required
					/>
				</div>
				<div style={styles.field}>
					<label style={styles.label}>Expiration Date:</label>
					<input
						type='date'
						value={expirationDate}
						onChange={(e) => setExpirationDate(e.target.value)}
						style={styles.input}
						required
					/>
				</div>
				<button
					type='submit'
					style={styles.button}>
					Create Promo Code
				</button>
			</form>

			<h3 style={styles.title}>Existing Promo Codes</h3>
			<ul style={styles.list}>
				{promoCodes.map((promo) => (
					<li
						key={promo._id}
						style={styles.listItem}>
						<span>
							<strong>Code:</strong> {promo.code}, <strong>Discount:</strong>{' '}
							{promo.discount}%, <strong>Expires:</strong>{' '}
							{new Date(promo.expirationDate).toLocaleDateString()}
						</span>
						<button
							onClick={() => handleDelete(promo._id)}
							style={styles.deleteButton}>
							Cancel
						</button>
					</li>
				))}
			</ul>
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
		boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
		backgroundColor: '#f9f9f9',
	},
	title: {
		textAlign: 'center',
		marginBottom: '20px',
		color: '#333',
		fontSize: '1.5em',
	},
	message: {
		textAlign: 'center',
		fontSize: '1em',
		marginBottom: '10px',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
	},
	field: {
		marginBottom: '15px',
	},
	label: {
		display: 'block',
		marginBottom: '5px',
		fontSize: '1em',
		fontWeight: 'bold',
		color: '#333',
	},
	input: {
		width: '100%',
		padding: '8px',
		fontSize: '1em',
		borderRadius: '4px',
		border: '1px solid #ccc',
	},
	button: {
		padding: '10px 15px',
		fontSize: '1em',
		borderRadius: '4px',
		border: 'none',
		backgroundColor: '#4CAF50',
		color: '#fff',
		cursor: 'pointer',
		transition: 'background-color 0.3s ease',
	},
	list: {
		listStyleType: 'none',
		padding: 0,
	},
	listItem: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '10px',
		padding: '10px',
		border: '1px solid #ccc',
		borderRadius: '4px',
		backgroundColor: '#fff',
	},
	deleteButton: {
		padding: '5px 10px',
		fontSize: '0.9em',
		borderRadius: '4px',
		border: 'none',
		backgroundColor: '#f44336',
		color: '#fff',
		cursor: 'pointer',
		transition: 'background-color 0.3s ease',
	},
};

export default PromoCodeForm;
