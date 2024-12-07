/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // For navigation if needed
import { useNavigate } from "react-router-dom";

const BuyTouristCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState(null); // To store the purchase status message
  const navigate = useNavigate();

  // Fetch the cart from the backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/tourists/getCart",
          config
        );

        setCartItems(response.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  // Handle the purchase of products
  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Call the backend to process the purchase
      const response = await axios.post(
        "http://localhost:3000/tourists/buyProductsCard",
        {}, // Empty body as it's using the user cart
        config
      );

      // If successful, show success message
      setPurchaseStatus({
        success: true,
        message: response.data.message,
        transactionDetails: response.data.transactionDetails,
      });

      // Clear cart after successful purchase
      setCartItems([]);
    } catch (error) {
      // If error occurs, show error message
      setPurchaseStatus({
        success: false,
        message: error.response?.data?.message || "Error during purchase.",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
      <h1 className="text-3xl font-bold text-teal-600 mb-6">Your Cart</h1>

      {error && <p className="text-red-500">{error}</p>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={`${item.productId._id}-${item.quantity}`}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:3000/photos/${item.productId.picture}`}
                  alt={item.productId.name}
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {item.productId.name}
                  </h2>
                  <p className="text-gray-500">${item.productId.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span>{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display total price */}
      <div className="mt-6 text-right">
        <p className="text-lg font-semibold">Total: ${getTotalPrice()}</p>
      </div>

      {/* Purchase Button */}
      <div className="mt-6">
        <button
          onClick={handlePurchase}
          className="bg-teal-500 text-white p-3 rounded-md"
          disabled={cartItems.length === 0} // Disable the button if the cart is empty
        >
          Complete Purchase
        </button>
      </div>

      {/* Purchase Status */}
      {purchaseStatus && (
        <div
          className={`mt-6 p-4 rounded-md ${
            purchaseStatus.success ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <p
            className={
              purchaseStatus.success ? "text-green-800" : "text-red-800"
            }
          >
            {purchaseStatus.message}
          </p>
          {purchaseStatus.success && (
            <div>
              <p>Transaction Details:</p>
              <ul>
                <li>
                  Total Cost: ${purchaseStatus.transactionDetails.totalCost}
                </li>
                <li>
                  Points Earned:{" "}
                  {purchaseStatus.transactionDetails.pointsEarned}
                </li>
                <li>
                  New Wallet Balance: $
                  {purchaseStatus.transactionDetails.updatedWalletBalance}
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyTouristCart;
