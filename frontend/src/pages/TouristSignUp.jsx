import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { touristSignup } from "../api";

const TouristSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobileNumber: "",
    nationality: "",
    dob: "",
    occupation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await touristSignup(formData);
      console.log("Signup successful");
      navigate("/tourist-Login");
    } catch (error) {
      console.error("Signup failed");
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
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          placeholder="Mobile Number"
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          placeholder="Date of Birth"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          placeholder="Nationality"
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          placeholder="Occupation"
          type="text"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded-md shadow-md hover:bg-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Sign Up
        </button>
        <Link to="/signup">
          <h1 className="text-center underline text-teal-500 hover:text-teal-600 transition-all duration-200">
            Sign Up as another role
          </h1>
        </Link>
      </form>
      {/* Already have an account? Login Link */}
      <div className="mt-4 text-center">
        <Link to="/tourist-Login">
          <h1 className="underline text-teal-500 hover:text-teal-600 transition-all duration-200">
            Already have an account as a tourist? Login
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default TouristSignUp;
