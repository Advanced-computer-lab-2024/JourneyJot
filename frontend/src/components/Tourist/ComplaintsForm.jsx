import React, { useState } from "react";
import axios from "axios";

const ComplaintsForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("Pending");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve the token from localStorage or another storage mechanism
      const token = localStorage.getItem('token'); // Ensure 'token' is the correct key

      if (!token) {
        console.error('No token found, user may not be logged in');
        // Optionally, you can redirect to the login page or display an error message
        return;
      }

      // Send a POST request to the backend to create a new complaint
      const response = await axios.post(
        "http://localhost:3000/complaints",
        { title, body, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Complaint posted:", response.data);
      // Optionally reset the form fields
      setTitle("");
      setBody("");
      setStatus("Pending");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized: Invalid or expired token');
        // Optionally, handle token expiration (e.g., redirect to login)
      } else {
        console.error("Error posting complaint:", error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Post a New Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default ComplaintsForm;
