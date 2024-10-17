/** @format */

import { useState } from "react";
import { touristLogin } from "../../api";
import { useNavigate } from "react-router-dom";

const TouristLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", // Updated: Login with username instead of email
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await touristLogin(formData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("Login successful", response.data);
      navigate("/tourist/homePage"); // Updated: Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login failed", error.response.data);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded-md shadow-md hover:bg-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default TouristLoginPage;
