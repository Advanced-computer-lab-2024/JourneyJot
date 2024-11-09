/** @format */

import { useState, useEffect } from "react";
import axios from "axios";

const History = () => {
  const [toursHistory, setToursHistory] = useState([]);

  useEffect(() => {
    fetchToursHistory();
  }, []);

  const fetchToursHistory = async () => {
    // implement
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-r from-teal-50 to-teal-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-900 mb-6">History</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {toursHistory.length > 0 ? (
          toursHistory.map((tour) => (
            <div key={tour.id} className="border-b border-gray-200 py-4">
              <h2 className="text-xl font-semibold">{tour.title}</h2>
              <p className="text-gray-600">
                Date: {new Date(tour.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Rating: {tour.rating}</p>
              <p className="text-gray-600">Comment: {tour.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tours history available.</p>
        )}
      </div>
    </div>
  );
};

export default History;
