/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const TouristReservations = () => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [activeTab, setActiveTab] = useState("activities");
  const [loading, setLoading] = useState({
    fetchReservations: false,
    cancel: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTouristReservations();
  }, []);

  const fetchTouristReservations = async () => {
    setLoading((prev) => ({ ...prev, fetchReservations: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const response = await axios.get(
        "http://localhost:3000/tourists/getTourist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setActivities(data.tourist.activities || []);
      setItineraries(data.tourist.itineraries || []);
      setAttractions(data.tourist.attractions || []);
      toast.success("Reservations fetched successfully!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch reservations.";
      toast.error(errorMsg);
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading((prev) => ({ ...prev, fetchReservations: false }));
    }
  };

  const cancelReservation = async (type, id, reservationDate) => {
    if (type !== "Attraction" && !canCancel(reservationDate)) {
      toast.error(
        "This reservation cannot be canceled within 48 hours of the start date."
      );
      return;
    }

    setLoading((prev) => ({ ...prev, cancel: true }));
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const response = await axios.post(
        `http://localhost:3000/tourists/cancel${type}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const successMsg =
        response.data.message || `${type} canceled successfully!`;
      toast.success(successMsg);
      fetchTouristReservations(); // Refresh reservations after cancellation
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        `Failed to cancel ${type}.`;
      toast.error(errorMsg);
      console.error(`Error canceling ${type}:`, err);
    } finally {
      setLoading((prev) => ({ ...prev, cancel: false }));
    }
  };

  const canCancel = (reservationDate) => {
    const now = new Date();
    const reservationTime = new Date(reservationDate);
    const diffInHours = (reservationTime - now) / (1000 * 60 * 60);
    return diffInHours > 48;
  };

  const renderCancelButton = (type, id, reservationDate = null) => (
    <button
      className={`mt-2 px-4 py-2 rounded-lg text-white shadow-md transition duration-200 ${
        loading.cancel
          ? "bg-red-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      }`}
      onClick={() => cancelReservation(type, id, reservationDate)}
      disabled={loading.cancel}
    >
      {loading.cancel ? "Canceling..." : "Cancel"}
    </button>
  );

  const renderTabContent = () => {
    const tabClassNames =
      "p-6 bg-white rounded-lg shadow-md transition-all duration-300";

    const noDataMessage = (
      <div className="text-center text-gray-600 italic">
        No items to display.
      </div>
    );

    switch (activeTab) {
      case "activities":
        return activities.length > 0
          ? activities.map((activity, index) => (
              <div
                key={index}
                className={`${tabClassNames} border-t-4 border-indigo-300`}
              >
                <h3 className="text-xl font-semibold text-indigo-800">
                  {activity.name}
                </h3>
                <p>{`Date: ${new Date(activity.date).toLocaleDateString()}`}</p>
                {renderCancelButton("Activity", activity._id, activity.date)}
              </div>
            ))
          : noDataMessage;

      case "itineraries":
        return itineraries.length > 0
          ? itineraries.map((itinerary, index) => (
              <div
                key={index}
                className={`${tabClassNames} border-t-4 border-pink-300`}
              >
                <h3 className="text-xl font-semibold text-pink-800">
                  {itinerary.name}
                </h3>
                <p>{`Duration: ${itinerary.duration}`}</p>
                {renderCancelButton("Itinerary", itinerary._id)}
              </div>
            ))
          : noDataMessage;

      case "attractions":
        return attractions.length > 0
          ? attractions.map((attraction, index) => (
              <div
                key={index}
                className={`${tabClassNames} border-t-4 border-green-300`}
              >
                <h3 className="text-xl font-semibold text-green-800">
                  {attraction.name}
                </h3>
                <p>{`Location: ${attraction.location}`}</p>
                {renderCancelButton("Attraction", attraction._id)}
              </div>
            ))
          : noDataMessage;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-700 hover:text-gray-900 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
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
        <div className="flex justify-center space-x-4 my-4">
          {["activities", "itineraries", "attractions"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                activeTab === tab
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="space-y-4">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default TouristReservations;
