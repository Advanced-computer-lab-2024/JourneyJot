/** @format */

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TouristItineraryNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      const response = await axios.get(
        "http://localhost:3000/tourists/itinerary-notification",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data.notifications || []); // Handle cases with no notifications
    } catch (err) {
      // Handle and log errors
      console.error("Error fetching notifications:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false); // Stop loading
    }
  }, []);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Render loading state
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-xl font-semibold text-gray-600">
          <span className="loader"></span> {/* Optional spinner */}
          Loading notifications...
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Render notifications
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300  flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
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
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Tourist Itinerary Notifications
        </h2>
        {notifications.length === 0 ? (
          <p className="text-gray-600 text-xl text-center">
            No notifications yet.
          </p>
        ) : (
          <ul className="space-y-6">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="p-6 bg-gray-100 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-gray-800 text-lg font-medium">
                    {notification.message}
                  </strong>
                  <small className="text-gray-500 ml-4 text-sm">
                    {new Date(notification.timestamp).toLocaleString()}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TouristItineraryNotifications;
