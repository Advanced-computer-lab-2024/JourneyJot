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
                    <strong>Advertiser:</strong> {activity.advertiserId}
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
                  <strong>Tour Guide:</strong> {itinerary.tourGuideId}
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
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg">
      {/* Upcoming Events Header */}
      <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-t-lg shadow-lg mb-6">
        <h1 className="text-4xl font-bold">Upcoming Events!</h1>
        <p className="mt-2 text-xl">
          Explore activities, itineraries, and attractions
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 justify-center mb-6">
        <button
          onClick={() => setActiveTab("activities")}
          className={`py-2 px-4 rounded-full text-lg font-medium ${
            activeTab === "activities"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Activities
        </button>
        <button
          onClick={() => setActiveTab("itineraries")}
          className={`py-2 px-4 rounded-full text-lg font-medium ${
            activeTab === "itineraries"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Itineraries
        </button>
        <button
          onClick={() => setActiveTab("attractions")}
          className={`py-2 px-4 rounded-full text-lg font-medium ${
            activeTab === "attractions"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Attractions
        </button>
      </div>

      {/* Render Content Based on Tab */}
      <div className="tab-content overflow-y-auto h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TouristReservations;
