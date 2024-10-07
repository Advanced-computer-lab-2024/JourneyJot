/** @format */

import { useState } from "react";
import { signup } from "../api";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "", // Add role field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      console.log("Signup successful", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error.response.data);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Sign Up
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          placeholder="Username"
          type="text"
          name="username"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          placeholder="Email"
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          placeholder="Password"
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="tour_guide">Tour Guide</option>
            <option value="advertiser">Advertiser</option>
          </select>
        </div>
        <button
          label="Sign Up"
          className="w-full bg-teal-500 text-white py-2 rounded-md shadow-md hover:bg-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Sign Up
        </button>
        <Link to="/Tourist-Signup">
          <h1 className="text-center underline text-teal-500 hover:text-teal-600 transition-all duration-200">
            Sign up as a tourist
          </h1>
        </Link>
      </form>

      {/* Already have an account? Log In Link */}
      <div className="mt-4 text-center">
        <Link to="/login">
          <h1 className="underline text-teal-500 hover:text-teal-600 transition-all duration-200">
            Already have an account? Log In
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
