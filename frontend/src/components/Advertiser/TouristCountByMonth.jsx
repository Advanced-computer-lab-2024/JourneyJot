/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const TouristCountByMonth = () => {
  const [touristCountByMonth, setTouristCountByMonth] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // User-selected month
  const navigate = useNavigate();
  const API_URL =
    "http://localhost:3000/tourists/touristCountByMonthForItinerary"; // Adjust the endpoint as necessary

  const fetchTouristData = async (month) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { month: month }, // Pass selected month as query parameter
      });

      setTouristCountByMonth(response.data.touristCountByMonth);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      fetchTouristData(selectedMonth);
    }
  }, [selectedMonth]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300  flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
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
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Tourists by Month
        </h1>

        {/* Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="monthSelect"
            className="block text-gray-600 font-medium mb-2"
          >
            Select a Month:
          </label>
          <select
            id="monthSelect"
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">-- Choose a Month --</option>
            <option value="1-2024">January 2024</option>
            <option value="2-2024">February 2024</option>
            <option value="3-2024">March 2024</option>
            {/* Add more months as needed */}
          </select>
        </div>

        {/* Loading and Error Handling */}
        {loading ? (
          <p className="text-center text-blue-500 font-semibold">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-medium">{error}</p>
        ) : (
          // Display Data
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Tourist Count by Month
            </h2>
            <ul className="space-y-2">
              {Object.entries(touristCountByMonth).map(([month, count]) => (
                <li
                  key={month}
                  className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
                >
                  <span className="text-gray-700 font-medium">{month}</span>
                  <span className="text-gray-900 font-bold">
                    {count} tourists
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristCountByMonth;
