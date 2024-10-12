import React from "react";

const ItinerariesCard = ({ itineraries = [] }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {itineraries.length > 0 ? (
        itineraries.map((itinerary) => (
          <div
            key={itinerary._id}
            className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex flex-col h-full space-y-4">
              {/* Tour Guide ID (optional display) */}
              <div className="text-gray-700">
                <span className="font-semibold">Tour Guide Name: </span>
                {itinerary.tourGuideId}{" "}
                {/* Display the tour guide Name instead of ID, using .populate in the get Request */}
              </div>

              {/* Itinerary Title (assumed as part of activities) */}
              <h2 className="text-xl font-semibold text-blue-900">
                Itinerary: {itinerary.activities.join(", ")}
              </h2>

              {/* Locations */}
              <div className="text-gray-700">
                <span className="font-semibold">Locations: </span>
                {itinerary.locations.join(", ")}
              </div>

              {/* Timeline */}
              <div className="text-gray-700">
                <span className="font-semibold">Timeline: </span>
                {itinerary.timeline}
              </div>

              {/* Duration */}
              <div className="text-gray-700">
                <span className="font-semibold">Duration: </span>
                {itinerary.duration}
              </div>

              {/* Language */}
              <div className="text-gray-700">
                <span className="font-semibold">Language: </span>
                {itinerary.language}
              </div>

              {/* Price */}
              <div className="text-gray-700">
                <span className="font-semibold">Price: </span>${itinerary.price}
              </div>

              {/* Rating */}
              {itinerary.rating && (
                <div className="text-gray-700">
                  <span className="font-semibold">Rating: </span>
                  {itinerary.rating} / 5
                </div>
              )}

              {/* Available Dates */}
              <div className="text-gray-700">
                <span className="font-semibold">Available Dates: </span>
                {itinerary.availableDates
                  .map((date) => new Date(date).toLocaleDateString())
                  .join(", ")}
              </div>

              {/* Accessibility */}
              <div className="text-gray-700">
                <span className="font-semibold">Accessibility: </span>
                {itinerary.accessibility}
              </div>

              {/* Pickup and Dropoff Locations */}
              <div className="text-gray-700">
                <span className="font-semibold">Pickup Location: </span>
                {itinerary.pickupLocation}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Dropoff Location: </span>
                {itinerary.dropoffLocation}
              </div>
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
