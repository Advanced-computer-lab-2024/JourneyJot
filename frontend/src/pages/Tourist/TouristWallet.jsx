/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TouristWallet = () => {
  const [walletBalance, setWalletBalance] = useState(null); // Initial balance state
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    // Function to fetch wallet balance from backend
    const fetchWalletBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Call backend endpoint to get wallet balance
        const response = await axios.get(
          "http://localhost:3000/tourists/wallet",
          config
        );
        setWalletBalance(response.data.walletBalance); // Update balance from response
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        alert("Failed to load wallet balance. Please try again later.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchWalletBalance(); // Trigger fetch on component mount
  }, []);

  const handleAddFunds = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add funds.");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Call backend endpoint to add funds
      const response = await axios.post(
        "http://localhost:3000/tourists/wallet/addFunds",
        {}, // Add data if needed for the request
        config
      );
      setWalletBalance(response.data.newBalance); // Update wallet balance in state

      alert("Funds added successfully!");
    } catch (error) {
      console.error("Error adding funds:", error);
      alert("Failed to add funds. Please try again later.");
    }
  };

  const handleViewHistory = () => {
    alert("Opening transaction history...");
    // Implement navigation to transaction history page or modal here
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 p-6">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl">
        <div>
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
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          My Wallet
        </h1>
        <div className="bg-gray-100 p-5 rounded-lg shadow-md text-center">
          {loading ? (
            <p className="text-lg text-gray-500">Loading...</p>
          ) : (
            <p className="text-xl font-semibold">
              Wallet Balance:{" "}
              <span className="text-green-600 font-bold">${walletBalance}</span>
            </p>
          )}
        </div>
        <div className="mt-6 space-y-4">
          <button
            className="w-full bg-green-600 text-white py-3 rounded-md shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleAddFunds}
          >
            Add $1000 to Wallet
          </button>
          <button
            className="w-full bg-gray-600 text-white py-3 rounded-md shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleViewHistory}
          >
            View Transaction History
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouristWallet;
