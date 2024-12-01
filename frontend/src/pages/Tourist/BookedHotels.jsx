import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookedHotels = () => {
    const [bookedHotels, setBookedHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hotelDetails, setHotelDetails] = useState(null); // State to store fetched hotel details

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    useEffect(() => {
        // Fetch booked hotels when component mounts
        const fetchBookedHotels = async () => {
            try {
                const response = await axios.get('http://localhost:3000/hotels', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookedHotels(response.data); // Set the booked hotels to state
            } catch (err) {
                console.error('Error fetching booked hotels:', err.message);
                setError('Failed to fetch booked hotels.');
            } finally {
                setLoading(false); // Set loading state to false after the request completes
            }
        };

        fetchBookedHotels();
    }, [token]);

    // Fetch hotel details by hotel ID
    const fetchHotelDetails = async (hotelId) => {
        try {
            const response = await axios.get(`http://localhost:3000/hotels/${hotelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data); // Log the hotel details
            setHotelDetails(response.data); // Store hotel details in state
        } catch (error) {
            console.error('Error fetching hotel details:', error);
        }
    };

    // Handle hotel cancellation
    const handleCancelHotel = async (hotelId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                const response = await axios.delete(`http://localhost:3000/hotels/${hotelId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                alert(response.data.message || 'Hotel booking canceled successfully!');
                setBookedHotels((prevHotels) =>
                    prevHotels.filter((hotel) => hotel._id !== hotelId)
                );
            } catch (err) {
                console.error('Error canceling hotel booking:', err.message);
                alert('Failed to cancel the booking.');
            }
        }
    };

    return (
        <div>
            <h1>Booked Hotels</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {bookedHotels.length === 0 && !loading && <p>No booked hotels found.</p>}

            {bookedHotels.length > 0 && (
                <ul>
                    {bookedHotels.map((hotel) => (
                        <li key={hotel._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
                            <h3>
                                <button onClick={() => fetchHotelDetails(hotel._id)}>
                                    {hotel.hotelName || 'Hotel Name Not Available'}
                                </button>
                            </h3>
                            <p>{hotel.location || 'Location Not Available'}</p>
                            <button
                                onClick={() => handleCancelHotel(hotel._id)}
                                style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none' }}
                            >
                                Cancel Booking
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Display hotel details if available */}
            {hotelDetails && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Hotel Details</h2>
                    <p><strong>Name:</strong> {hotelDetails.hotelName}</p>
                    <p><strong>Location:</strong> {hotelDetails.location}</p>
                    <p><strong>Check-in Date:</strong> {hotelDetails.checkInDate}</p>
                    <p><strong>Check-out Date:</strong> {hotelDetails.checkOutDate}</p>
                    <p><strong>Price:</strong> {hotelDetails.price.total} {hotelDetails.price.currency}</p>
                    <p><strong>Rooms Available:</strong> {hotelDetails.roomsAvailable}</p>
                </div>
            )}
        </div>
    );
};

export default BookedHotels;
