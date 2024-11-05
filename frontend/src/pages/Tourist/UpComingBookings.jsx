/** @format */

import { useState, useEffect } from "react";
import axios from "axios";

const UpcomingBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchUpcomingBookings();
    }, []);

    const fetchUpcomingBookings = async () => {
        //implement
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-6">Upcoming Bookings</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.id} className="border-b border-gray-200 py-4">
                            <h2 className="text-xl font-semibold">{booking.title}</h2>
                            <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                            <p className="text-gray-600">Status: {booking.status}</p>
                            <p className="text-gray-600">Tour Guide: {booking.tourGuide}</p>
                            <p className="text-gray-600">Itinerary: {booking.itinerary}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No upcoming bookings available.</p>
                )}
            </div>
        </div>
    );
};

export default UpcomingBookings;
