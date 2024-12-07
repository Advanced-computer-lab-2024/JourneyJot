/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TouristNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await axios.get(
          "http://localhost:3000/tourists/activity-notification",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(response.data.notifications || []);
      } catch (err) {
        setError(err.message || "Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-xl">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
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
          Tourist Notifications
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
                className="p-6 bg-gray-50 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-gray-800 text-lg font-semibold">
                    {notification.message}
                  </strong>
                  <small className="text-gray-500 ml-4 text-sm">
                    {new Date(notification.timestamp).toLocaleString()}
                  </small>
                </div>

                {/* Display additional activity details */}
                {notification.activityDetails && (
                  <div className="mt-4 space-y-2 text-gray-600">
                    <p>
                      <span className="font-semibold">Activity:</span>{" "}
                      {notification.activityDetails.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {notification.activityDetails.date || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Time:</span>{" "}
                      {notification.activityDetails.time || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span>{" "}
                      {notification.activityDetails.price
                        ? `$${notification.activityDetails.price}`
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Price Range:</span>{" "}
                      {notification.activityDetails.priceRange || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Special Discounts:</span>{" "}
                      {notification.activityDetails.specialDiscounts || "None"}
                    </p>
                    <p>
                      <span className="font-semibold">Booking Status:</span>{" "}
                      {notification.activityDetails.bookingOpen
                        ? "Open"
                        : "Closed"}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TouristNotifications;
