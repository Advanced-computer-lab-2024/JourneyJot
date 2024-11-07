import React from "react";
import axios from "axios";

// StarRating Component to display stars
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating); // Full stars (whole numbers)
  const emptyStars = 5 - fullStars; // Remaining empty stars

  return (
    <div className="flex space-x-1">
      {[...Array(fullStars)].map((_, index) => (
        <svg
          key={`full-${index}`}
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15.27l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L10 3 7.19 8.82 2 9.24l3.46 3.67-1.64 5.09L10 15.27z" />
        </svg>
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <svg
          key={`empty-${index}`}
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.75l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L12 3l-2.81 5.82-5.19.42L7.46 15.42 3 18.15 12 17.75z"
          />
        </svg>
      ))}
    </div>
  );
};

const ItinerariesCard = ({ itineraries = [] }) => {
  const handleShareItinerary = (itinerary) => {
    alert(`Share link for itinerary: ${itinerary.name}`);
    // Implement actual sharing logic here
  };

  const handleBookTicket = async (itinerary) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const respone = await axios.post(
        "http://localhost:3000/tourists/bookItinerary",
        { itineraryId: itinerary },
        config
      );

      console.log(respone);
    } catch (error) {
      console.error("Error booking itinerary:", error);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {itineraries.length > 0 ? (
        itineraries.map((itinerary) => (
          <div
            key={itinerary._id}
            className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex flex-col h-full space-y-4 text-left">
              <h2 className="text-xl font-semibold text-blue-900">Itinerary</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {/* Tour Guide ID (optional display) */}
                <li>
                  <span className="font-semibold">Tour Guide Name: </span>
                  {itinerary.tourGuideId?.username || "Unknown"}{" "}
                  {/* Use the `username` field or any other relevant property */}
                </li>

                {/* Itinerary Title (assumed as part of activities) */}
                <li>
                  <span className="font-semibold">Activities: </span>
                  {itinerary.activities.join(", ")}
                </li>

                {/* Locations */}
                <li>
                  <span className="font-semibold">Locations: </span>
                  {itinerary.locations.join(", ")}
                </li>

                {/* Timeline */}
                <li>
                  <span className="font-semibold">Timeline: </span>
                  {itinerary.timeline}
                </li>

                {/* Duration */}
                <li>
                  <span className="font-semibold">Duration: </span>
                  {itinerary.duration}
                </li>

                {/* Language */}
                <li>
                  <span className="font-semibold">Language: </span>
                  {itinerary.language}
                </li>

                {/* Price */}
                <li>
                  <span className="font-semibold">Price: </span>$
                  {itinerary.price}
                </li>

                {/* Available Dates */}
                <li>
                  <span className="font-semibold">Available Dates: </span>
                  {itinerary.availableDates
                    .map((date) => new Date(date).toLocaleDateString())
                    .join(", ")}
                </li>

                {/* Accessibility */}
                <li>
                  <span className="font-semibold">Accessibility: </span>
                  {itinerary.accessibility}
                </li>

                {/* Pickup and Dropoff Locations */}
                <li>
                  <span className="font-semibold">Pickup Location: </span>
                  {itinerary.pickupLocation}
                </li>
                <li>
                  <span className="font-semibold">Dropoff Location: </span>
                  {itinerary.dropoffLocation}
                </li>

                {/* Rating */}
                {typeof itinerary.rating === "number" && (
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">Rating:</span>
                    <StarRating rating={itinerary.rating} />
                  </li>
                )}
              </ul>
              <button
                onClick={() => handleBookTicket(itinerary._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
              >
                Book A Ticket
              </button>
              <button
                onClick={() => handleShareItinerary(itinerary)}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
              >
                Share
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No itineraries available.
        </p>
      )}
    </div>
  );
};

export default ItinerariesCard;
