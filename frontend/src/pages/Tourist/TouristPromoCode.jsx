/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const PromoCodesPage = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/tourists/promoCodes",
          config
        );

        setPromoCodes(response.data.promoCodes);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch promo codes"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPromoCodes();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold">Loading promo codes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-600 border border-red-300 p-4 rounded-md shadow-sm">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6">
      <div className=" from-blue-200 via-indigo-300 to-purple-400 p-6min-h-screen p-6">
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
        <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Your Promo Codes
          </h2>
          {promoCodes.length === 0 ? (
            <p className="text-gray-600">No promo codes available</p>
          ) : (
            <ul className="space-y-4">
              {promoCodes.map((promo) => (
                <li
                  key={promo._id}
                  className="p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition"
                >
                  <div className="mb-2">
                    <span className="font-medium text-blue-600">Code:</span>{" "}
                    <span className="font-mono text-gray-800">
                      {promo.code}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-blue-600">Discount:</span>{" "}
                    <span className="text-gray-800">{promo.discount}%</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-600">Expires:</span>{" "}
                    <span className="text-gray-800">
                      {new Date(promo.expirationDate).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoCodesPage;
