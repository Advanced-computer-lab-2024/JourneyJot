/** @format */

import React, { useState } from 'react';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
	Snackbar,
	Alert,
} from '@mui/material';

const HotelBookingModal = ({ open, onClose, onSubmit }) => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
	});

	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validateFields = () => {
		const newErrors = {};
		if (!formData.firstName) newErrors.firstName = 'First name is required.';
		if (!formData.lastName) newErrors.lastName = 'Last name is required.';
		if (!formData.email) newErrors.email = 'Email is required.';
		if (!formData.phone) newErrors.phone = 'Phone number is required.';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (validateFields()) {
			setIsLoading(true);
			try {
				await onSubmit(formData); // Submit booking
				setSuccessMessage('Booking successful!'); // Show success message
				setErrorMessage(''); // Clear any previous error message
			} catch (error) {
				setErrorMessage('Error submitting booking. Please try again.'); // Show error message
				setSuccessMessage(''); // Clear success message
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleClose = () => {
		setFormData({
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
		});
		setErrors({});
		setSuccessMessage(''); // Reset success message
		setErrorMessage(''); // Reset error message
		onClose();
	};

	return (
		<>
			<Dialog
				open={open}
				onClose={handleClose}>
				<DialogTitle>Enter Your Details</DialogTitle>
				<DialogContent>
					<TextField
						name='firstName'
						label='First Name'
						fullWidth
						margin='dense'
						value={formData.firstName}
						onChange={handleChange}
						error={!!errors.firstName}
						helperText={errors.firstName}
					/>
					<TextField
						name='lastName'
						label='Last Name'
						fullWidth
						margin='dense'
						value={formData.lastName}
						onChange={handleChange}
						error={!!errors.lastName}
						helperText={errors.lastName}
					/>
					<TextField
						name='email'
						label='Email'
						fullWidth
						margin='dense'
						value={formData.email}
						onChange={handleChange}
						error={!!errors.email}
						helperText={errors.email}
					/>
					<TextField
						name='phone'
						label='Phone'
						fullWidth
						margin='dense'
						value={formData.phone}
						onChange={handleChange}
						error={!!errors.phone}
						helperText={errors.phone}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading}>
						{isLoading ? 'Booking...' : 'Book'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Success/Error Snackbar */}
			<Snackbar
				open={!!successMessage || !!errorMessage}
				autoHideDuration={6000}
				onClose={() => {
					setSuccessMessage('');
					setErrorMessage('');
				}}>
				<Alert
					onClose={() => {
						setSuccessMessage('');
						setErrorMessage('');
					}}
					severity={successMessage ? 'success' : 'error'}
					sx={{ width: '100%' }}>
					{successMessage || errorMessage}
				</Alert>
			</Snackbar>
		</>
	);
};

export default HotelBookingModal;
