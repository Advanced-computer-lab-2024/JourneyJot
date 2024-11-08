import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState("date_desc"); // Default sort by date descending
  const [statusFilter, setStatusFilter] = useState(""); // No filter by default

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        console.log('Fetching complaints with sortOrder:', sortOrder); 

        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, admin may not be logged in');
          // Optionally, redirect to login page or display an error message
          return;
        }

        // Send the selected sort and filter options as query parameters
        const response = await axios.get("http://localhost:3000/complaints/admin", {
          params: {
            sort: sortOrder,
            status: statusFilter,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, [sortOrder, statusFilter]); // Re-fetch whenever sort or filter changes

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Complaints</h2>
      
      {/* Filter and Sort Controls */}
      <div className="flex justify-between mb-4">
        <div>
          <label className="mr-2">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 p-1 rounded-md"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label className="mr-2">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 p-1 rounded-md"
          >
            <option value="date_desc">Date Descending</option>
            <option value="date_asc">Date Ascending</option>
          </select>
        </div>
      </div>

      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id} className="border-b py-2">
            <Link to={`/admins/view-complaint/${complaint._id}`} className="text-blue-600 hover:underline">
              <p><strong>Title:</strong> {complaint.title}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
              <p><strong>Date:</strong> {new Date(complaint.date).toLocaleString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminComplaintsPage;
