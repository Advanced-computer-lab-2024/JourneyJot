/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";

const TouristReservations = () => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [activeTab, setActiveTab] = useState("activities"); // default to activities tab

  useEffect(() => {
    fetchTouristReservations();
  }, []);

  const fetchTouristReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        "http://localhost:3000/tourists/getTourist",
        config
      );
      setActivities(response.data.tourist.activities);
      setItineraries(response.data.tourist.itineraries);
      setAttractions(response.data.tourist.attractions);
    } catch (err) {
      console.error(err);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "activities":
        return activities.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Activities</h2>
            {activities.map((activity, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-r from-indigo-50 to-purple-100 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-indigo-700">
                  Activity #{index + 1}
                </h3>
                {activity.advertiserId && (
                  <p className="text-gray-800">
                    <strong>Advertiser:</strong>{" "}
                    {activity.advertiserId?.username}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Date:</strong>{" "}
                  {new Date(activity.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <strong>Time:</strong> {activity.time}
                </p>
                {activity.location && activity.location.coordinates && (
                  <p className="text-gray-700">
                    <strong>Location:</strong>{" "}
                    {`Longitude: ${activity.location.coordinates[0]}, Latitude: ${activity.location.coordinates[1]}`}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Price:</strong> ${activity.price}
                </p>
                {activity.category && (
                  <p className="text-gray-700">
                    <strong>Category:</strong> {activity.category}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No activities available.</div>
        );
      case "itineraries":
        return itineraries.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Itineraries</h2>
            {itineraries.map((itinerary, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-r from-pink-50 to-yellow-100 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-pink-700">
                  Itinerary #{index + 1}
                </h3>
                <p className="text-gray-800">
                  <strong>Tour Guide:</strong> {itinerary.tourGuideId?.username}
                </p>
                <p className="text-gray-700">
                  <strong>Activities:</strong> {itinerary.activities.join(", ")}
                </p>
                <p className="text-gray-700">
                  <strong>Locations:</strong> {itinerary.locations.join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No itineraries available.</div>
        );
      case "attractions":
        return attractions.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Attractions</h2>
            {attractions.map((attraction, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-r from-green-50 to-blue-100 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-green-700">
                  {attraction.name}
                </h3>
                {attraction.description && (
                  <p className="text-gray-800">
                    <strong>Description:</strong> {attraction.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No attractions available.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-center space-x-6 mb-10">
        <button
          className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
            activeTab === "activities"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("activities")}
        >
          Activities
        </button>
        <button
          className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
            activeTab === "itineraries"
              ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("itineraries")}
        >
          Itineraries
        </button>
        <button
          className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
            activeTab === "attractions"
              ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("attractions")}
        >
          Attractions
        </button>
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default TouristReservations;
