/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Function to retrieve token from localStorage
const getToken = () => {
  return localStorage.getItem("token") || "";
};

// Custom hook to handle notifications fetching
const useNotifications = (token) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/sellers/notifications",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setNotifications(response.data.notifications);
        } catch (error) {
          setError("Error fetching notifications.");
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    } else {
      setError("No token found.");
      setLoading(false);
    }
  }, [token]);

  return { notifications, loading, error };
};

// Custom hook to handle stock update
const useUpdateStock = (token) => {
  const updateStock = async (productName, newQuantity) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/sellers/update-stock",
        { productName, newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  return { updateStock };
};

const NotifySellerProduct = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [authToken, setAuthToken] = useState(getToken());

  const { notifications, loading, error } = useNotifications(authToken);
  const { updateStock } = useUpdateStock(authToken);

  const handleUpdateStock = () => {
    if (productName && newQuantity) {
      updateStock(productName, newQuantity);
    } else {
      alert("Please provide both product name and new quantity.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300   flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-xl space-y-8">
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
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Seller Dashboard
        </h1>

        {/* Update Stock Form */}
        <section>
          <h2 className="text-3xl font-medium text-gray-700 mb-6">
            Update Product Stock
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="mt-1 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                New Quantity
              </label>
              <input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="Enter new quantity"
                className="mt-1 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleUpdateStock}
              className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Stock
            </button>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="text-3xl font-medium text-gray-700 mb-6">
            Notifications
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">
              Loading notifications...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : notifications.length > 0 ? (
            <ul className="space-y-6">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="bg-gray-100 p-6 rounded-lg shadow-md hover:bg-gray-200 transition-colors"
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No notifications available
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default NotifySellerProduct;
