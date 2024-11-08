
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:3000/complaints/admin"); // Adjust URL if needed
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Complaints</h2>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id} className="border-b py-2">
            <p><strong>Title:</strong> {complaint.title}</p>
            <p><strong>Body:</strong> {complaint.body}</p>
            <p><strong>Status:</strong> {complaint.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminComplaints;
