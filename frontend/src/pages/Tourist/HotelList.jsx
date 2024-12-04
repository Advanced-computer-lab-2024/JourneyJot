/** @format */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HotelBookingModal from './HotelBookingModal';

const HotelList = () => {
	const [hotels, setHotels] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [error, setError] = useState('');
	const [adults, setAdults] = useState(1);
	const [rooms, setRooms] = useState(1);
	const [nights, setNights] = useState(2);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedHotel, setSelectedHotel] = useState(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const retryRequest = async (fn, retries = 5, delay = 1000) => {
		for (let attempt = 0; attempt < retries; attempt++) {
			try {
				return await fn(); // Attempt the function
			} catch (err) {
				console.error(`Attempt ${attempt + 1} failed:`, err.message);
				if (attempt === retries - 1) throw err; // Throw error if all retries fail
				await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
			}
		}
	};

	// Fetch destination ID
	const fetchDestinationId = async () => {
		return await retryRequest(
			async () => {
				const response = await axios.get(
					`http://localhost:3000/amadeus/locations?query=${searchQuery}`
				);
				const results = response.data?.data;
				if (!results || results.length === 0) {
					throw new Error('No data received from the API.');
				}

				const destination = results.find((item) => item.result_type === 'geos');
				if (!destination) {
					throw new Error('No valid geographic destinations found.');
				}

				return destination.result_object.location_id;
			},
			5,
			1000
		); // Retry up to 3 times with a 1-second delay
	};

	const fetchHotels = async (locationId) => {
		return await retryRequest(
			async () => {
				const response = await axios.get(
					`http://localhost:3000/amadeus/hotels`,
					{
						params: {
							location_id: locationId,
							adults,
							rooms,
							nights,
							currency: 'USD',
							limit: 10,
						},
					}
				);

				if (
					!response.data ||
					!response.data.data ||
					response.data.data.length === 0
				) {
					throw new Error('No hotels found for the selected destination.');
				}

				setHotels(response.data.data);
				setError('');
			},
			5,
			4000
		); // Retry up to 10 times with a 1-second delay
	};

	const handleSearch = async () => {
		setError('');
		setLoading(true);
		setHotels([]);

		try {
			const locationId = await fetchDestinationId();
			if (locationId) {
				await fetchHotels(locationId);
			}
		} catch (err) {
			console.error('Search error:', err);
			setError('An error occurred while searching. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	// Open modal for booking
	const openModal = (hotel) => {
		setSelectedHotel(hotel);
		setIsModalOpen(true);
	};

	// Close modal
	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedHotel(null);
	};
	const handleBookingSubmit = async (formData) => {
		if (!selectedHotel || !selectedHotel.location_id) {
			alert('Hotel ID is missing. Please select a valid hotel.');
			return;
		}

		// Map necessary fields for the booking
		const bookingData = {
			hotelId: selectedHotel.location_id, // Hotel ID from the API response
			hotelName: selectedHotel.name, // Hotel name
			location: selectedHotel.location_string, // Hotel location
			imageUrl:
				selectedHotel.photo?.images?.medium?.url ||
				'https://via.placeholder.com/150', // Hotel image URL
			checkInDate: new Date().toISOString(), // Set check-in date (example: current date)
			checkOutDate: new Date(
				Date.now() + nights * 24 * 60 * 60 * 1000
			).toISOString(), // Set check-out date
			price: {
				total: selectedHotel.price?.split(' - ')[0].replace('$', '') || '0.00', // Parse the price
				currency: 'USD', // Set the currency
			},
			roomsAvailable: 1, // Example value; adjust as needed
			guestName: `${formData.firstName} ${formData.lastName}`, // Guest name from the form
		};

		console.log('Booking Data:', bookingData); // Log the booking data for debugging

		try {
			const response = await axios.post(
				'http://localhost:3000/hotels/book',
				bookingData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`, // Add authorization if required
					},
				}
			);

			alert(
				`Booking successful! Wallet balance: ${response.data.wallet}, Points: ${response.data.points}`
			);
			closeModal();
		} catch (err) {
			console.error('Error booking hotel:', err.response?.data || err.message);
			alert('Failed to book hotel. Please try again.');
		}
	};
	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6'>
			<div style={styles.container}>
				<h1 style={styles.header}>Hotel List</h1>
				<button
					onClick={() => navigate('/booked-hotels')}
					style={styles.button}>
					View Booked Hotels
				</button>
				<div style={styles.searchContainer}>
					<input
						type='text'
						placeholder='Search for a destination (e.g., Cairo)'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						style={styles.input}
					/>
				</div>
				<div style={styles.parameters}>
					<label style={styles.label}>
						Adults:
						<input
							type='number'
							min='1'
							value={adults}
							onChange={(e) => setAdults(Number(e.target.value))}
							style={styles.inputNumber}
						/>
					</label>
					<label style={styles.label}>
						Rooms:
						<input
							type='number'
							min='1'
							value={rooms}
							onChange={(e) => setRooms(Number(e.target.value))}
							style={styles.inputNumber}
						/>
					</label>
					<label style={styles.label}>
						Nights:
						<input
							type='number'
							min='1'
							value={nights}
							onChange={(e) => setNights(Number(e.target.value))}
							style={styles.inputNumber}
						/>
					</label>
				</div>
				<button
					onClick={handleSearch}
					style={styles.button}>
					{loading ? 'Loading...' : 'Search'}
				</button>
				{loading && <p style={styles.loadingMessage}>Loading...</p>}
				{error && <p style={styles.error}>{error}</p>}
				{hotels.length > 0 && (
					<div style={styles.hotelList}>
						{hotels.map((hotel) => (
							<div
								key={hotel.location_id}
								style={styles.card}>
								<img
									src={
										hotel.photo?.images?.medium?.url ||
										'https://via.placeholder.com/150'
									}
									alt={hotel.name}
									style={styles.image}
								/>
								<div style={styles.cardContent}>
									<h2 style={styles.hotelName}>{hotel.name}</h2>
									<p style={styles.location}>{hotel.location_string}</p>
									<p style={styles.rating}>
										Rating: {hotel.rating || 'N/A'} ({hotel.num_reviews || '0'}{' '}
										reviews)
									</p>
									<p style={styles.price}>
										Price: {hotel.price || 'Price not available'}
									</p>
									<button
										style={styles.bookButton}
										onClick={() => openModal(hotel)}>
										Book Now
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Booking Modal */}
				<HotelBookingModal
					open={isModalOpen}
					onClose={closeModal}
					onSubmit={handleBookingSubmit}
				/>
			</div>
		</div>
	);
};

const styles = {
	container: {
		fontFamily: 'Arial, sans-serif',
		padding: '20px',
		maxWidth: '1200px',
		margin: '0 auto',
	},
	header: {
		textAlign: 'center',
		color: '#333',
	},
	searchContainer: {
		marginBottom: '20px',
		textAlign: 'center',
	},
	input: {
		padding: '10px',
		width: '80%',
		fontSize: '16px',
		borderRadius: '4px',
		border: '1px solid #ccc',
	},
	parameters: {
		display: 'flex',
		justifyContent: 'center',
		gap: '15px',
		marginBottom: '20px',
	},
	label: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		fontSize: '14px',
	},
	inputNumber: {
		padding: '5px',
		width: '50px',
		textAlign: 'center',
		fontSize: '16px',
		borderRadius: '4px',
		border: '1px solid #ccc',
	},
	button: {
		display: 'block',
		margin: '0 auto',
		padding: '10px 20px',
		backgroundColor: '#007BFF',
		color: '#fff',
		fontSize: '16px',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
	},
	error: {
		color: 'red',
		textAlign: 'center',
		marginBottom: '20px',
	},
	hotelList: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: '20px',
		justifyContent: 'center',
	},
	card: {
		width: '300px',
		border: '1px solid #ccc',
		borderRadius: '8px',
		overflow: 'hidden',
		boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
		transition: 'transform 0.2s',
		backgroundColor: '#fff',
	},
	image: {
		width: '100%',
		height: '200px',
		objectFit: 'cover',
	},
	cardContent: {
		padding: '15px',
	},
	hotelName: {
		fontSize: '18px',
		margin: '10px 0',
		color: '#333',
	},
	location: {
		color: '#666',
		fontSize: '14px',
	},
	rating: {
		fontSize: '14px',
		color: '#333',
	},
	price: {
		fontSize: '16px',
		fontWeight: 'bold',
		color: '#28a745',
	},
	bookButton: {
		padding: '10px 20px',
		backgroundColor: '#28a745',
		color: '#fff',
		fontSize: '14px',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		marginTop: '10px',
		textAlign: 'center',
		width: '100%',
	},
	modal: {
		position: 'fixed',
		top: '0',
		left: '0',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingMessage: {
		textAlign: 'center',
		fontSize: '18px',
		color: '#007BFF',
		margin: '20px 0',
	},

	modalContent: {
		backgroundColor: '#fff',
		padding: '20px',
		borderRadius: '8px',
		textAlign: 'center',
		width: '400px',
	},
	closeButton: {
		padding: '10px 20px',
		backgroundColor: '#ccc',
		color: '#fff',
		fontSize: '14px',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
	},
	bookNowButton: {
		padding: '10px 20px',
		backgroundColor: '#007BFF',
		color: '#fff',
		fontSize: '14px',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		marginTop: '10px',
	},
};

export default HotelList;
