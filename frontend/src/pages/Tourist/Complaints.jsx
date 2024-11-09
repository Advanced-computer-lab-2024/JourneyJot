import React from "react";
import ComplaintsForm from "../../components/Tourist/ComplaintsForm";
import SubmittedComplaints from "../../components/Tourist/SubmittedComplaints";

const Complaints = () => {
  return (
    <div className="flex flex-col items-center min-w-full p-4 bg-gradient-to-r from-teal-50 to-teal-100 min-h-screen">
      <div className="max-w-3xl w-full mb-6">
        {/* Adjusted width here */}
        <ComplaintsForm />
      </div>
      <div className="max-w-3xl w-full">
        {/* Adjusted width here */}
        <SubmittedComplaints />
      </div>
    </div>
  );
};

export default Complaints;
