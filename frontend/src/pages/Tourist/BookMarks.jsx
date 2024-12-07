/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookMarks = () => {
  const [savedActivities, setSavedActivities] = useState([]);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [savedAttractions, setSavedAttractions] = useState([]);
  const [activeTab, setActiveTab] = useState("activities");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch bookmarks on mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setError(null); // Reset error on fetch
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(
          "http://localhost:3000/tourists/bookmarks",
          config
        );

        setSavedActivities(response.data.savedActivities || []);
        setSavedItineraries(response.data.savedItineraries || []);
        setSavedAttractions(response.data.savedAttractions || []);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError(err.response?.data?.message || "Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // Remove a bookmark
  const removeBookmark = async (type, id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(
        `http://localhost:3000/tourists/bookmarks/${type}/${id}`,
        config
      );

      if (type === "activities") {
        setSavedActivities((prev) => prev.filter((item) => item._id !== id));
      } else if (type === "itineraries") {
        setSavedItineraries((prev) => prev.filter((item) => item._id !== id));
      } else if (type === "attractions") {
        setSavedAttractions((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Error removing bookmark:", err);
      setError(err.response?.data?.message || "Failed to remove bookmark.");
    }
  };

  // Render tab content
  const renderTabContent = () => {
    const items =
      activeTab === "activities"
        ? savedActivities
        : activeTab === "itineraries"
        ? savedItineraries
        : savedAttractions;

    if (loading) {
      return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (items.length === 0) {
      return (
        <p className="text-gray-500">
          No bookmarks available in this category.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          >
            <ul className="space-y-3">
              {activeTab === "activities" && (
                <>
                  <li className="text-gray-700">
                    <span className="font-semibold">Activity Name: </span>
                    {item.name}
                  </li>

                  <li className="text-gray-700">
                    <span className="font-semibold">Date: </span>
                    {new Date(item.date).toLocaleDateString()}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Time: </span>
                    {item.time}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Special Discounts: </span>
                    {item.specialDiscounts || "N/A"}
                  </li>

                  <li className="text-gray-700">
                    <span className="font-semibold">Booking Status: </span>
                    {item.bookingOpen ? "Open" : "Closed"}
                  </li>
                  <button
                    onClick={() => navigate("/notify-tourist-activities")}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg mt-4"
                  >
                    Notification Activities
                  </button>
                </>
              )}
              {activeTab === "itineraries" && (
                <>
                  <li className="text-gray-700">
                    <span className="font-semibold">Itinerary Name: </span>
                    {item.name}
                  </li>

                  <li className="text-gray-700">
                    <span className="font-semibold">Timeline: </span>
                    {item.timeline}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Duration: </span>
                    {item.duration}
                  </li>
                  <li>
                    <span className="text-gray-700">Available Dates: </span>
                    {item.availableDates.join(", ")}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Language: </span>
                    {item.language}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Accessibility: </span>
                    {item.accessibility}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Pickup Location: </span>
                    {item.pickupLocation}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Dropoff Locations: </span>
                    {item.dropoffLocation}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Booking Status: </span>
                    {item.bookingOpen ? "Open" : "Closed"}
                  </li>
                  <button
                    onClick={() => navigate("/notify-tourist-itineraries")}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg mt-4"
                  >
                    Notification Itineraries
                  </button>
                </>
              )}
              {activeTab === "attractions" && (
                <>
                  <li className="text-gray-700">
                    <span className="font-semibold">Governor Name: </span>
                    {item.governorId?.name || "N/A"}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Name: </span>
                    {item.name || "N/A"}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Description: </span>
                    {item.description || "No description available."}
                  </li>
                </>
              )}
            </ul>

            <button
              onClick={() => removeBookmark(activeTab, item._id)}
              className="w-full py-2 mt-4 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Remove Bookmark
            </button>
          </div>
        ))}
      </div>
    );
  };

  const tabs = {
    activities: "Activities",
    itineraries: "Itineraries",
    attractions: "Attractions",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6">
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
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          My Bookmarks
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          {Object.keys(tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setError(null); // Reset error on tab switch
              }}
              className={`px-6 py-2 rounded-lg mx-3 text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {tabs[tab]}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Tab content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BookMarks;
