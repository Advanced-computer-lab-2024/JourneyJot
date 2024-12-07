/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RequestOTP = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Retrieve the JWT token from localStorage (or wherever it's stored)
  const token = localStorage.getItem("token"); // Adjust this if token is stored elsewhere

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    try {
      // Send the JWT token in the Authorization header
      const response = await axios.post(
        "http://localhost:3000/forget/request-otp",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the request headers
          },
        }
      );
      setMessage(response.data.message);
      setError("");
      // After requesting OTP, navigate to the Verify OTP page
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300  flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
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
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email below, and we'll send you an OTP to reset your
          password.
        </p>
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g., yourname@example.com"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Request OTP
          </button>
        </form>
        {message && (
          <div className="mt-6 p-4 text-sm text-green-800 bg-green-100 rounded-lg shadow">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 text-sm text-red-800 bg-red-100 rounded-lg shadow">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestOTP;
