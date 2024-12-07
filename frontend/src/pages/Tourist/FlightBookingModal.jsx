/** @format */

import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FlightBookingModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    emailAddress: "",
    phone: "",
    documentNumber: "",
    issuanceCountry: "",
    nationality: "",
    issuanceDate: "",
    expiryDate: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required.";
    if (!formData.emailAddress)
      newErrors.emailAddress = "Email address is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.documentNumber)
      newErrors.documentNumber = "Document number is required.";
    if (!formData.issuanceCountry)
      newErrors.issuanceCountry = "Issuance country is required.";
    if (!formData.nationality)
      newErrors.nationality = "Nationality is required.";
    if (!formData.issuanceDate)
      newErrors.issuanceDate = "Issuance date is required.";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required.";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit(formData);
    }
  };

  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Enter Passenger Details</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill in the details to book the flight.
        </DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          name="firstName"
          label="First Name"
          type="text"
          fullWidth
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          margin="dense"
          name="lastName"
          label="Last Name"
          type="text"
          fullWidth
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="emailAddress"
              label="Email Address"
              type="email"
              fullWidth
              value={formData.emailAddress}
              onChange={handleChange}
              error={!!errors.emailAddress}
              helperText={errors.emailAddress}
            />
          </Grid>
        </Grid>
        <TextField
          margin="dense"
          name="phone"
          label="Phone Number"
          type="tel"
          fullWidth
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <TextField
          margin="dense"
          name="documentNumber"
          label="Document Number"
          type="text"
          fullWidth
          value={formData.documentNumber}
          onChange={handleChange}
          error={!!errors.documentNumber}
          helperText={errors.documentNumber}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="issuanceCountry"
              label="Issuance Country"
              type="text"
              fullWidth
              value={formData.issuanceCountry}
              onChange={handleChange}
              error={!!errors.issuanceCountry}
              helperText={errors.issuanceCountry}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="nationality"
              label="Nationality"
              type="text"
              fullWidth
              value={formData.nationality}
              onChange={handleChange}
              error={!!errors.nationality}
              helperText={errors.nationality}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="issuanceDate"
              label="Issuance Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.issuanceDate}
              onChange={handleChange}
              error={!!errors.issuanceDate}
              helperText={errors.issuanceDate}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="expiryDate"
              label="Expiry Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.expiryDate}
              onChange={handleChange}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Book
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightBookingModal;
