import React, { useState, useEffect } from "react";
import axios from "axios";

const SubmittedComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Fetch complaints from the backend when the component mounts
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:3000/complaints");
        setComplaints(response.data); // Assumes response.data contains the array of complaints
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submitted Complaints</h2>
      {complaints.length === 0 ? (
        <p className="text-gray-700">No complaints submitted yet.</p>
      ) : (
        <div className="max-h-64 overflow-auto">
          {" "}
          {/* Add these classes for scroll */}
          <ul>
            {complaints.map((complaint) => (
              <li
                key={complaint._id}
                className="mb-4 p-4 border border-gray-300 rounded-md"
              >
                <h3 className="text-lg font-semibold">{complaint.title}</h3>
                <h4 className="text-gray-600 mb-2">{complaint.body}</h4>
                <h6 className="text-gray-600 mb-2">{complaint.date}</h6>
                <span
                  className={`px-2 py-1 rounded-full text-white ${
                    complaint.status === "Pending"
                      ? "bg-yellow-500"
                      : complaint.status === "In Progress"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                >
                  {complaint.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubmittedComplaints;
