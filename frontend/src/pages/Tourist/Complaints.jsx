/** @format */

import React from "react";
import ComplaintsForm from "../../components/Tourist/ComplaintsForm";
import SubmittedComplaints from "../../components/Tourist/SubmittedComplaints";
import { useNavigate } from "react-router-dom";

const Complaints = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-w-full p-4 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 min-h-screen">
      {/* Back Button */}
      <div className="flex items-start min-w-full mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-700 text-lg flex items-center hover:text-gray-900 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Complaints Form */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
          Submit Your Complaint
        </h2>
        <ComplaintsForm />
      </div>

      {/* Submitted Complaints */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
          Your Complaints
        </h2>
        <SubmittedComplaints />
      </div>
    </div>
  );
};

export default Complaints;
