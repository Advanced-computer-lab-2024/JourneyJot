/** @format */

import { useState } from "react";
import { touristLogin } from "../../api";
import { useNavigate, Link } from "react-router-dom";

const TouristLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before attempting login
    setSuccess(null); // Reset success before attempting login
    try {
      const response = await touristLogin(formData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/tourist/homePage"), 1000); // Delay for success message
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 ">
      <div className="max-w-md w-full bg-white p-8 shadow-2xl rounded-lg border-t-8 border-indigo-600">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Welcome Tourist
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please log in to access your account
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Username"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/tourist-signup">
            <span className="text-indigo-600 hover:text-indigo-800 transition-all duration-200">
              Don't have an account?{" "}
              <span className="font-semibold">Sign Up</span>
            </span>
          </Link>
          <br />
          <br />
          <Link to="/login">
            <span className="text-indigo-600 hover:text-indigo-800 transition-all duration-200">
              Login as Another User
              <span className="font-semibold"></span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TouristLoginPage;
