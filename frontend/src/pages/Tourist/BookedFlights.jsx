import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookedFlights = () => {
  const [bookedFlights, setBookedFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Retrieve the logged-in user's token (assumed stored in localStorage)
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookedFlights = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/flights`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookedFlights(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching booked flights:", err.message);
        setError("Failed to fetch booked flights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookedFlights();
    } else {
      setError("No token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  const handleCancelFlight = async (flightId) => {
    if (!window.confirm("Are you sure you want to cancel this flight?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/flights/${flightId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        response.data.message || "Flight booking canceled successfully!"
      );
      setError(null);

      // Remove the canceled flight from the list
      setBookedFlights((prevFlights) =>
        prevFlights.filter((flight) => flight._id !== flightId)
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error canceling flight booking:", err.message);
      setError("Failed to cancel the flight booking.");
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-lg p-6 overflow-auto">
        {/* Back Arrow */}
        <div className="flex items-start min-w-full">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 text-xl mb-4 flex items-center hover:text-gray-900 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Booked Flights
        </h1>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        )}

        {/* No Booked Flights Message */}
        {!loading && bookedFlights.length === 0 && (
          <p className="text-center text-gray-500">No booked flights found.</p>
        )}

        {/* Booked Flights List */}
        {!loading && bookedFlights.length > 0 && (
          <div className="mt-6">
            <ul className="space-y-6">
              {bookedFlights.map((flight) => (
                <li
                  key={flight._id}
                  className="bg-gray-100 rounded-lg shadow-md p-6"
                >
                  {/* Passenger Details */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">
                      Passenger Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <p>
                        <strong>First Name:</strong>{" "}
                        {flight.passenger?.firstName || "N/A"}
                      </p>
                      <p>
                        <strong>Last Name:</strong>{" "}
                        {flight.passenger?.lastName || "N/A"}
                      </p>
                      <p>
                        <strong>Date of Birth:</strong>{" "}
                        {flight.passenger?.dateOfBirth || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {flight.passenger?.emailAddress || "N/A"}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {flight.passenger?.phone || "N/A"}
                      </p>
                      <p>
                        <strong>Document Number:</strong>{" "}
                        {flight.passenger?.documentNumber || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">
                      Flight Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <p>
                        <strong>Flight ID:</strong> {flight.flightId || "N/A"}
                      </p>
                      <p>
                        <strong>Origin:</strong> {flight.origin || "N/A"}
                      </p>
                      <p>
                        <strong>Destination:</strong>{" "}
                        {flight.destination || "N/A"}
                      </p>
                      <p>
                        <strong>Departure Date:</strong>{" "}
                        {flight.departureDate || "N/A"}
                      </p>
                      <p>
                        <strong>Total Price:</strong>{" "}
                        {flight.price?.total || "N/A"}{" "}
                        {flight.price?.currency || ""}
                      </p>
                      <p>
                        <strong>Seats Available:</strong>{" "}
                        {flight.seatsAvailable || "N/A"}
                      </p>
                      <p>
                        <strong>Airline:</strong>{" "}
                        {flight.airline?.join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Cancel Booking Button */}
                  <div className="text-right">
                    <button
                      onClick={() => handleCancelFlight(flight._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedFlights;
