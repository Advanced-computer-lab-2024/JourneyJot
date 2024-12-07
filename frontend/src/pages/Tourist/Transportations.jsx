/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transportation = () => {
  const [transportationList, setTransportationList] = useState([]);
  const [bookedTransportations, setBookedTransportations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [loading, setLoading] = useState({
    fetchTransportation: false,
    book: false,
    cancel: false,
  });

  const navigate = useNavigate(); // Ensure you have imported useNavigate from 'react-router-dom'

  // Fetch available transportation on component mount
  useEffect(() => {
    const fetchTransportation = async () => {
      setLoading((prev) => ({ ...prev, fetchTransportation: true }));
      try {
        const response = await axios.get(
          "http://localhost:3000/transportation"
        ); // Replace with your API endpoint for transportation
        setTransportationList(response.data);
        toast.success("Transportation options fetched successfully!");
      } catch (err) {
        toast.error("Failed to fetch transportation options");
        console.error("Error fetching transportation:", err);
      } finally {
        setLoading((prev) => ({ ...prev, fetchTransportation: false }));
      }
    };

    const fetchBookedTransportations = async () => {
      setLoading((prev) => ({ ...prev, fetchTransportation: true }));
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/tourists/bookedTransportations",
          config
        );
        setBookedTransportations(response.data);
        toast.success("Booked transportations fetched successfully!");
      } catch (err) {
        toast.error("Failed to fetch booked transportations");
        console.error("Error fetching booked transportations:", err);
      } finally {
        setLoading((prev) => ({ ...prev, fetchTransportation: false }));
      }
    };

    fetchTransportation();
    fetchBookedTransportations();
  }, []);

  // Handle seat selection
  const handleSeatSelection = (id, seats) => {
    setSelectedSeats((prev) => ({ ...prev, [id]: seats }));
  };

  // Handle booking a transportation
  const handleBookTransportation = async (id, availableSeats, pricePerSeat) => {
    const seatsToBook = selectedSeats[id] || 1; // Default to 1 seat if no selection

    // Check if selected seats exceed available seats
    if (seatsToBook > availableSeats) {
      toast.error("Selected seats exceed available seats.");
      return;
    }

    setLoading((prev) => ({ ...prev, book: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Debugging: Log the data being sent
      console.log("Booking Data:", {
        transportationId: id,
        seats: seatsToBook,
      });

      const response = await axios.post(
        `http://localhost:3000/tourists/bookTransportation/${id}`,
        { seats: seatsToBook },
        config
      );
      toast.success(
        response.data.message || "Transportation booked successfully!"
      );

      // Refresh booked transportations after booking
      setBookedTransportations((prev) => [
        ...prev,
        {
          ...response.data.transportation,
          bookedSeats: seatsToBook,
        },
      ]);

      // Update the available seats in the list
      setTransportationList((prevList) =>
        prevList.map((item) =>
          item._id === id
            ? { ...item, availableSeats: item.availableSeats - seatsToBook }
            : item
        )
      );

      // Reset selected seats
      setSelectedSeats((prev) => ({ ...prev, [id]: 1 }));
    } catch (err) {
      const errorMsg = err.response
        ? err.response.data.message
        : "Failed to book transportation";
      toast.error(errorMsg);
      console.error("Error booking transportation:", err);
    } finally {
      setLoading((prev) => ({ ...prev, book: false }));
    }
  };

  // Handle canceling a booking
  const handleCancelBooking = async (id) => {
    setLoading((prev) => ({ ...prev, cancel: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(
        `http://localhost:3000/tourists/cancelBooking/${id}`,
        config
      );
      toast.success(response.data.message || "Booking canceled successfully!");

      // Update booked transportations after cancellation
      setBookedTransportations((prev) =>
        prev.filter((item) => item._id !== id)
      );

      // Update the available seats in the list
      // Assuming the backend returns the number of seats canceled
      const canceledSeats = response.data.canceledSeats || 1;
      setTransportationList((prevList) =>
        prevList.map((item) =>
          item._id === response.data.transportationId
            ? {
                ...item,
                availableSeats: item.availableSeats + canceledSeats,
              }
            : item
        )
      );
    } catch (err) {
      const errorMsg = err.response
        ? err.response.data.message
        : "Failed to cancel booking";
      toast.error(errorMsg);
      console.error("Error canceling booking:", err);
    } finally {
      setLoading((prev) => ({ ...prev, cancel: false }));
    }
  };

  return (
    <div className="min-w-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple">
      <div className=" p-4">
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
      <div className="min-h-screen  flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          {/* Toast Container for Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">
            Available Transportation
          </h1>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {/* Loader for Transportation List */}
          {loading.fetchTransportation ? (
            <div className="flex justify-center items-center">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {transportationList.map((transportation) => (
                <div
                  key={transportation._id}
                  className="relative bg-white shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl"
                >
                  {/* Transportation Details */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {transportation.vehicleType}
                    </h2>
                    <p className="mt-2 text-gray-600">
                      <strong>Location:</strong> {transportation.location}
                    </p>
                    <p className="text-gray-600">
                      <strong>Available Seats:</strong>{" "}
                      {transportation.availableSeats}
                    </p>
                    <p className="text-gray-600">
                      <strong>Price per Seat:</strong> $
                      {transportation.pricePerSeat}
                    </p>
                    {/* Seat Selection */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Seats
                      </label>
                      <select
                        value={selectedSeats[transportation._id] || 1}
                        onChange={(e) =>
                          handleSeatSelection(
                            transportation._id,
                            parseInt(e.target.value)
                          )
                        }
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[...Array(transportation.availableSeats).keys()].map(
                          (_, index) => (
                            <option key={index + 1} value={index + 1}>
                              {index + 1}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    {/* Book Now Button */}
                    <button
                      className={`mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 ${
                        loading.book ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() =>
                        handleBookTransportation(
                          transportation._id,
                          transportation.availableSeats,
                          transportation.pricePerSeat
                        )
                      }
                      disabled={loading.book}
                    >
                      {loading.book ? "Booking..." : "Book Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <h1 className="text-3xl font-semibold text-center text-gray-900 mt-16 mb-8">
            My Booked Transportations
          </h1>
          {bookedTransportations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookedTransportations.map((booking) => (
                <div
                  key={booking._id}
                  className="relative bg-white shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl"
                >
                  {/* Booking Details */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking.vehicleType}
                    </h2>
                    <p className="mt-2 text-gray-600">
                      <strong>Location:</strong> {booking.location}
                    </p>
                    <p className="text-gray-600">
                      <strong>Booked Seats:</strong> {booking.bookedSeats}
                    </p>
                    <p className="text-gray-600">
                      <strong>Price per Seat:</strong> ${booking.pricePerSeat}
                    </p>
                    {/* Cancel Booking Button */}
                    <button
                      className={`mt-4 w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 ${
                        loading.cancel ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={loading.cancel}
                    >
                      {loading.cancel ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No bookings found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transportation;
