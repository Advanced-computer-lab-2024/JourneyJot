/** @format */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const FlightOffers = ({ flightOffers = [], onBook }) => {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  // Handle booking and show success/error messages
  const handleBook = (offer) => {
    try {
      onBook(offer);
      setMessage({ type: "success", text: "Flight booked successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to book the flight. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
        Available Flight Offers
      </h2>

      {/* Inline Success/Error Message */}
      {message && (
        <div
          className={`text-center p-4 mb-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {flightOffers.length === 0 ? (
        <p className="text-lg text-center text-white">
          No flights available for the selected criteria. Please try a different
          search.
        </p>
      ) : (
        <ul className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {flightOffers.map((offer) => {
            const {
              id,
              itineraries = [],
              price = {},
              validatingAirlineCodes = [],
            } = offer;

            const itinerary = itineraries[0] || {};
            const segments = itinerary.segments || [];
            const departure = segments[0]?.departure || {};
            const arrival = segments[segments.length - 1]?.arrival || {};
            const duration =
              itinerary?.duration?.replace("PT", "").toLowerCase() || "N/A";
            const stops = segments.length > 0 ? segments.length - 1 : 0;
            const airline = validatingAirlineCodes.join(", ") || "N/A";
            const totalPrice = price.total || "N/A";
            const currency = price.currency || "";
            const departureTime = departure.at
              ? new Date(departure.at).toLocaleString()
              : "N/A";
            const arrivalTime = arrival.at
              ? new Date(arrival.at).toLocaleString()
              : "N/A";

            return (
              <li
                key={id}
                className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                  Flight ID: {id}
                </h3>
                <p>
                  <strong>Airline:</strong> {airline}
                </p>
                <p>
                  <strong>Origin:</strong> {departure.iataCode || "N/A"}
                </p>
                <p>
                  <strong>Destination:</strong> {arrival.iataCode || "N/A"}
                </p>
                <p>
                  <strong>Departure Time:</strong> {departureTime}
                </p>
                <p>
                  <strong>Arrival Time:</strong> {arrivalTime}
                </p>
                <p>
                  <strong>Duration:</strong> {duration}
                </p>
                <p>
                  <strong>Number of Stops:</strong> {stops}
                </p>
                <p>
                  <strong>Total Price:</strong> {totalPrice} {currency}
                </p>
                <button
                  onClick={() => handleBook(offer)}
                  className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
                >
                  Book This Flight
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// Prop Types
FlightOffers.propTypes = {
  flightOffers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      itineraries: PropTypes.arrayOf(
        PropTypes.shape({
          segments: PropTypes.arrayOf(
            PropTypes.shape({
              departure: PropTypes.shape({
                iataCode: PropTypes.string,
                at: PropTypes.string,
              }),
              arrival: PropTypes.shape({
                iataCode: PropTypes.string,
                at: PropTypes.string,
              }),
            })
          ),
          duration: PropTypes.string,
        })
      ),
      price: PropTypes.shape({
        total: PropTypes.string,
        currency: PropTypes.string,
      }),
      validatingAirlineCodes: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  onBook: PropTypes.func.isRequired,
};

export default FlightOffers;
