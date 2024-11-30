import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const HotelBookingModal = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
                await onSubmit(formData);
            } catch (error) {
                console.error('Error submitting booking:', error);
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
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Enter Your Details</DialogTitle>
            <DialogContent>
                <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    margin="dense"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                />
                <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    margin="dense"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                />
                <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    margin="dense"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    name="phone"
                    label="Phone"
                    fullWidth
                    margin="dense"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Booking...' : 'Book'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HotelBookingModal;
