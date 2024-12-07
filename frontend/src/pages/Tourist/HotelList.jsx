/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HotelList = () => {
  // State Management
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [nights, setNights] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // Add more fields as necessary
  });

  const navigate = useNavigate();

  // Retry Function for API Calls
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

  // Fetch Destination ID
  const fetchDestinationId = async () => {
    return await retryRequest(
      async () => {
        const response = await axios.get(
          `http://localhost:3000/amadeus/locations?query=${encodeURIComponent(
            searchQuery
          )}`
        );
        const results = response.data?.data;
        if (!results || results.length === 0) {
          throw new Error("No data received from the API.");
        }

        const destination = results.find((item) => item.result_type === "geos");
        if (!destination) {
          throw new Error("No valid geographic destinations found.");
        }

        return destination.result_object.location_id;
      },
      5,
      1000
    );
  };

  // Fetch Hotels Based on Location ID
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
              currency: "USD",
              limit: 10,
            },
          }
        );

        if (
          !response.data ||
          !response.data.data ||
          response.data.data.length === 0
        ) {
          throw new Error("No hotels found for the selected destination.");
        }

        setHotels(response.data.data);
        setError("");
      },
      5,
      4000
    );
  };

  // Handle Search Button Click
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setError("Please enter a destination to search.");
      return;
    }

    setError("");
    setLoading(true);
    setHotels([]);

    try {
      const locationId = await fetchDestinationId();
      if (locationId) {
        await fetchHotels(locationId);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err.message || "An error occurred while searching. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Open Modal for Booking
  const openModal = (hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
    setFormData({
      firstName: "",
      lastName: "",
      // Reset other fields as necessary
    });
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  // Handle Booking Submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedHotel || !selectedHotel.location_id) {
      alert("Hotel ID is missing. Please select a valid hotel.");
      return;
    }

    // Validate form data
    if (formData.firstName.trim() === "" || formData.lastName.trim() === "") {
      alert("Please enter your first and last name.");
      return;
    }

    // Map necessary fields for the booking
    const bookingData = {
      hotelId: selectedHotel.location_id, // Hotel ID from the API response
      hotelName: selectedHotel.name, // Hotel name
      location: selectedHotel.location_string, // Hotel location
      imageUrl:
        selectedHotel.photo?.images?.medium?.url ||
        "https://via.placeholder.com/150", // Hotel image URL
      checkInDate: new Date().toISOString(), // Set check-in date (example: current date)
      checkOutDate: new Date(
        Date.now() + nights * 24 * 60 * 60 * 1000
      ).toISOString(), // Set check-out date
      price: {
        total: selectedHotel.price
          ? parseFloat(
              selectedHotel.price.replace("$", "").split(" - ")[0]
            ).toFixed(2)
          : "0.00", // Parse the price
        currency: "USD", // Set the currency
      },
      roomsAvailable: 1, // Example value; adjust as needed
      guestName: `${formData.firstName} ${formData.lastName}`, // Guest name from the form
    };

    console.log("Booking Data:", bookingData); // Log the booking data for debugging

    try {
      const response = await axios.post(
        "http://localhost:3000/hotels/book",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization if required
          },
        }
      );

      alert(
        `Booking successful! Wallet balance: ${response.data.wallet}, Points: ${response.data.points}`
      );
      closeModal();
    } catch (err) {
      console.error("Error booking hotel:", err.response?.data || err.message);
      alert("Failed to book hotel. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6">
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
      <div className="font-sans p-6 max-w-6xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-teal-600 mb-6">
          Hotel List
        </h1>

        {/* Navigation Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/booked-hotels")}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="View Booked Hotels"
          >
            View Booked Hotels
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for a destination (e.g., Cairo)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Search Destination"
          />
        </div>

        {/* Search Parameters */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <label className="flex flex-col items-center">
            Adults:
            <input
              type="number"
              min="1"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="mt-1 p-2 w-20 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Number of Adults"
            />
          </label>
          <label className="flex flex-col items-center">
            Rooms:
            <input
              type="number"
              min="1"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="mt-1 p-2 w-20 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Number of Rooms"
            />
          </label>
          <label className="flex flex-col items-center">
            Nights:
            <input
              type="number"
              min="1"
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
              className="mt-1 p-2 w-20 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Number of Nights"
            />
          </label>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-center"
            aria-label="Search Hotels"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
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
                Loading...
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError("")}
              aria-label="Close Error Message"
            >
              &times;
            </button>
          </div>
        )}

        {/* Hotel Listings */}
        {hotels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.location_id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={
                    hotel.photo?.images?.medium?.url ||
                    "https://via.placeholder.com/300x200"
                  }
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {hotel.name}
                  </h2>
                  <p className="text-gray-600">{hotel.location_string}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 mr-2">★</span>
                    <span className="text-gray-700">
                      {hotel.rating || "N/A"}
                    </span>
                    <span className="text-gray-500 ml-1">
                      ({hotel.num_reviews || 0} reviews)
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-bold text-teal-600">
                    Price: {hotel.price || "Price not available"}
                  </p>
                  <button
                    onClick={() => openModal(hotel)}
                    className="mt-4 w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label={`Book ${hotel.name}`}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {isModalOpen && selectedHotel && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            aria-modal="true"
            role="dialog"
          >
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Close Modal"
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">
                Book {selectedHotel.name}
              </h2>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    aria-required="true"
                  />
                </div>
                {/* Add more form fields as needed */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    aria-label="Cancel Booking"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Submit Booking"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelList;
