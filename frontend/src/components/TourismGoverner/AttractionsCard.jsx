/** @format */

import React from "react";

const AttractionsCard = ({ attractions = [] }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {attractions.length > 0 ? (
        attractions.map((attraction) => (
          <div
            key={attraction._id}
            className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex flex-col h-full space-y-4 text-left">
              {/* Name */}
              <h2 className="text-xl font-semibold text-blue-900">
                {attraction.name || "No name provided"}{" "}
                {/* Handle optional name */}
              </h2>

              {/* Description */}
              <p className="text-gray-600">
                {attraction.description || "No description available."}{" "}
                {/* Handle optional description */}
              </p>

              {/* Activities */}
              {/* Removed as not defined in the schema */}

              {/* Pictures */}
              {attraction.pictures && attraction.pictures.length > 0 && (
                <div className="text-gray-700">
                  <span className="font-semibold">Pictures: </span>
                  {attraction.pictures.join(", ")}
                </div>
              )}

              {/* Location */}
              <div className="text-gray-700">
                <span className="font-semibold">Location: </span>
                {attraction.location || "Location not specified."}{" "}
                {/* Handle optional location */}
              </div>

              {/* Opening Hours */}
              <div className="text-gray-700">
                <span className="font-semibold">Opening Hours: </span>
                {attraction.openingHours || "Hours not available."}{" "}
                {/* Handle optional opening hours */}
              </div>

              {/* Ticket Prices */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Ticket Prices:
                </h3>
                <ul className="mt-2 space-y-1">
                  {attraction.ticketPrices && (
                    <>
                      <li className="text-gray-700">
                        <span className="font-semibold">Natives: </span>$
                        {attraction.ticketPrices.native || "N/A"}
                      </li>
                      <li className="text-gray-700">
                        <span className="font-semibold">Foreigners: </span>$
                        {attraction.ticketPrices.foreigner || "N/A"}
                      </li>
                      <li className="text-gray-700">
                        <span className="font-semibold">Students: </span>$
                        {attraction.ticketPrices.student || "N/A"}
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Tags */}
              {attraction.tags && attraction.tags.length > 0 && (
                <div className="text-gray-700">
                  <span className="font-semibold">Tags: </span>
                  <ul className="list-disc pl-5">
                    {attraction.tags.map((tag) => (
                      <li key={tag._id}>{tag.name || "No tag name"}</li> // Handle optional tag name
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No attractions available.
        </p>
      )}
    </div>
  );
};

export default AttractionsCard;
