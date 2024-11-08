// frontend/src/pages/Admin/ComplaintDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ComplaintDetails = () => {
  const { id } = useParams(); // Get the complaint ID from the route parameters
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");

  // Fetch complaint details by ID
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/complaints/admin/${id}`);
        setComplaint(response.data);
        setStatus(response.data.status); // Initialize status from data
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      }
    };
    fetchComplaint();
  }, [id]);

  // Function to update status and reply
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/complaints/admin/${id}`, { status, reply });
      alert("Complaint updated successfully!");
      // Optionally, you can re-fetch the updated complaint data here
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  if (!complaint) return <p>Loading complaint details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Complaint Details</h2>
      <p><strong>Username:</strong> {complaint.username || "None"}</p>
      <p><strong>Title:</strong> {complaint.title}</p>
      <p><strong>Body:</strong> {complaint.body}</p>
      <p><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> {complaint.status}</p>
      <p><strong>Reply:</strong> {complaint.reply || "No reply yet"}</p>

      <div className="mt-4">
        <label className="block text-gray-700">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full"
        >
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Reply:</label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        ></textarea>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700"
      >
        Update Complaint
      </button>
    </div>
  );
};

export default ComplaintDetails;
