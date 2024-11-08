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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Activities</h2>
            {activities.map((activity, index) => (
              <div
                key={index}
                className="space-y-4 p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Activity #{index + 1}
                </h3>
                {activity.advertiserId && (
                  <p className="text-gray-700">
                    <strong>Advertiser:</strong>
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
                {activity.priceRange && (
                  <p className="text-gray-700">
                    <strong>Price Range:</strong> {activity.priceRange}
                  </p>
                )}
                {activity.category && (
                  <p className="text-gray-700">
                    <strong>Category:</strong> {activity.category}
                  </p>
                )}
                {activity.preferenceTag && (
                  <p className="text-gray-700">
                    <strong>Preference Tag:</strong> {activity.preferenceTag}
                  </p>
                )}
                {activity.specialDiscounts && (
                  <p className="text-gray-700">
                    <strong>Special Discounts:</strong>{" "}
                    {activity.specialDiscounts}
                  </p>
                )}
                {activity.rating && (
                  <p className="text-gray-700">
                    <strong>Rating:</strong> {activity.rating} / 5
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Booking Open:</strong>{" "}
                  {activity.bookingOpen ? "Yes" : "No"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No activities available.</div>
        );
      case "itineraries":
        return itineraries.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Itineraries</h2>
            {itineraries.map((itinerary, index) => (
              <div
                key={index}
                className="space-y-4 p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Itinerary #{index + 1}
                </h3>
                <p className="text-gray-700">
                  <strong>Tour Guide:</strong> {itinerary.tourGuideId?.username}
                </p>
                <p className="text-gray-700">
                  <strong>Activities:</strong> {itinerary.activities.join(", ")}
                </p>
                <p className="text-gray-700">
                  <strong>Locations:</strong> {itinerary.locations.join(", ")}
                </p>
                <p className="text-gray-700">
                  <strong>Timeline:</strong> {itinerary.timeline}
                </p>
                <p className="text-gray-700">
                  <strong>Duration:</strong> {itinerary.duration}
                </p>
                <p className="text-gray-700">
                  <strong>Language:</strong> {itinerary.language}
                </p>
                <p className="text-gray-700">
                  <strong>Price:</strong> ${itinerary.price}
                </p>
                {itinerary.rating && (
                  <p className="text-gray-700">
                    <strong>Rating:</strong> {itinerary.rating} / 5
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Accessibility:</strong> {itinerary.accessibility}
                </p>
                <p className="text-gray-700">
                  <strong>Pickup Location:</strong> {itinerary.pickupLocation}
                </p>
                <p className="text-gray-700">
                  <strong>Dropoff Location:</strong> {itinerary.dropoffLocation}
                </p>
                <p className="text-gray-700">
                  <strong>Available Dates:</strong>{" "}
                  {itinerary.availableDates.join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No itineraries available.</div>
        );
      case "attractions":
        return attractions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Attractions</h2>
            {attractions.map((attraction, index) => (
              <div
                key={index}
                className="space-y-4 p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {attraction.name}
                </h3>
                {attraction.governorId && (
                  <p className="text-gray-700">
                    <strong>Governor:</strong> {attraction.governorId?.username}
                  </p>
                )}
                {attraction.description && (
                  <p className="text-gray-700">
                    <strong>Description:</strong> {attraction.description}
                  </p>
                )}
                {attraction.pictures && attraction.pictures.length > 0 && (
                  <div className="space-y-2">
                    <strong>Pictures:</strong>
                    <div className="flex space-x-2">
                      {attraction.pictures.map((pic, idx) => (
                        <img
                          key={idx}
                          src={pic}
                          alt={`Attraction picture ${idx + 1}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
                {attraction.location && (
                  <p className="text-gray-700">
                    <strong>Location:</strong> {attraction.location}
                  </p>
                )}
                {attraction.openingHours && (
                  <p className="text-gray-700">
                    <strong>Opening Hours:</strong> {attraction.openingHours}
                  </p>
                )}
                {attraction.ticketPrices && (
                  <div className="text-gray-700">
                    <strong>Ticket Prices:</strong>
                    {attraction.ticketPrices.native && (
                      <p>Native: ${attraction.ticketPrices.native}</p>
                    )}
                    {attraction.ticketPrices.foreigner && (
                      <p>Foreigner: ${attraction.ticketPrices.foreigner}</p>
                    )}
                    {attraction.ticketPrices.student && (
                      <p>Student: ${attraction.ticketPrices.student}</p>
                    )}
                  </div>
                )}
                {attraction.tags && attraction.tags.length > 0 && (
                  <p className="text-gray-700">
                    <strong>Tags:</strong> {attraction.tags.join(", ")}
                  </p>
                )}
                {attraction.website && (
                  <p className="text-blue-600 underline">
                    <a
                      href={attraction.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </a>
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
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "activities"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("activities")}
        >
          Activities
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "itineraries"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("itineraries")}
        >
          Itineraries
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "attractions"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
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
