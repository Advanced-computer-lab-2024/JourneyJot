// pages/Tourist/ComplaintDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TouristComplaintDetails = () => {
  const { id } = useParams(); // Get the complaint ID from the URL
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, user may not be logged in');
          return;
        }
        const response = await axios.get(`http://localhost:3000/complaints/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComplaint(response.data);
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      }
    };
    fetchComplaint();
  }, [id]);

  if (!complaint) return <p>Loading complaint details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Complaint Details</h2>
      <p><strong>Title:</strong> {complaint.title}</p>
      <p><strong>Body:</strong> {complaint.body}</p>
      <p><strong>Date:</strong> {new Date(complaint.date).toLocaleString()}</p>
      <p><strong>Status:</strong> {complaint.status}</p>
      {complaint.reply && (
        <p><strong>Reply:</strong> {complaint.reply}</p>
      )}
    </div>
  );
};

export default TouristComplaintDetails;
