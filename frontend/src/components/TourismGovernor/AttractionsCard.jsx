/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";

const AttractionsCard = () => {
  const [attractions, setAttractions] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  // Fetch data from the API using axios
  useEffect(() => {
    axios
      .get("http://localhost:3000/attractions") // Replace with your API endpoint for attractions
      .then((response) => {
        setAttractions(response.data);
        const allTags = response.data.flatMap((attraction) => attraction.tags);
        const uniqueTags = [...new Set(allTags)];
        setTags(uniqueTags);
      })
      .catch((error) => {
        console.error("Error fetching attractions:", error);
      });
  }, []);

  // Handle the filtering based on selected tag
  const handleFilterChange = (event) => {
    setSelectedTag(event.target.value);
  };

  // Filter the attractions based on the selected tag
  const filteredAttractions = selectedTag
    ? attractions.filter(
        (attraction) => attraction.tags && attraction.tags.includes(selectedTag)
      )
    : attractions;

  const handleBookTicket = async (attraction) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const respone = await axios.post(
        "http://localhost:3000/tourists/bookAttraction",
        { attractionId: attraction },
        config
      );

      console.log(respone);
    } catch (error) {
      console.error("Error booking attraction:", error);
    }
  };

  const handleShareAttraction = (attraction) => {
    alert(`Share link for itinerary: ${attraction.name}`);
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="mb-4">
        <label htmlFor="filter" className="font-semibold text-gray-700">
          Filter by Tag:
        </label>
        <select
          id="filter"
          className="ml-2 border border-gray-300 rounded-md p-2"
          value={selectedTag}
          onChange={handleFilterChange}
        >
          <option value="">All Tags</option>
          {tags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Attractions Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
        {filteredAttractions.length > 0 ? (
          filteredAttractions.map((attraction) => (
            <div
              key={attraction._id}
              className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="flex flex-col h-full space-y-6">
                <h2 className="text-2xl font-semibold text-blue-900">
                  {attraction.name || "No name provided"}
                </h2>

                {/* Description */}
                <ul className="list-disc pl-5 text-left text-gray-700 space-y-1">
                  <li>
                    <span className="font-semibold">Description: </span>
                    {attraction.description || "No description available."}
                  </li>

                  {/* Pictures */}
                  {attraction.pictures && attraction.pictures.length > 0 && (
                    <li>
                      <span className="font-semibold">Pictures: </span>
                      <ul className="list-disc pl-5">
                        {attraction.pictures.map((pic, index) => (
                          <li key={index}>{pic}</li>
                        ))}
                      </ul>
                    </li>
                  )}

                  {/* Location */}
                  <li>
                    <span className="font-semibold">Location: </span>
                    {attraction.location || "Location not specified."}
                  </li>

                  {/* Opening Hours */}
                  <li>
                    <span className="font-semibold">Opening Hours: </span>
                    {attraction.openingHours || "Hours not available."}
                  </li>

                  {/* Ticket Prices */}
                  <li>
                    <span className="font-semibold">Ticket Prices: </span>
                    <ul className="list-disc pl-5">
                      {attraction.ticketPrices ? (
                        <>
                          <li>
                            <span className="font-semibold">Natives: </span>$
                            {attraction.ticketPrices.native || "N/A"}
                          </li>
                          <li>
                            <span className="font-semibold">Foreigners: </span>$
                            {attraction.ticketPrices.foreigner || "N/A"}
                          </li>
                          <li>
                            <span className="font-semibold">Students: </span>$
                            {attraction.ticketPrices.student || "N/A"}
                          </li>
                        </>
                      ) : (
                        "Prices not available"
                      )}
                    </ul>
                  </li>

                  {/* Tags */}
                  {attraction.tags && attraction.tags.length > 0 && (
                    <li>
                      <span className="font-semibold">Tags: </span>
                      <ul className="list-disc pl-5">
                        {attraction.tags.map((tag, index) => (
                          <li key={index}>{tag || "No tag name"}</li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>

                {/* Book and Share Buttons */}
                <div className="flex flex-col space-y-2 mt-4">
                  <button
                    className="py-2 px-4 bg-green-600 text-white rounded-md"
                    onClick={() => handleBookTicket(attraction._id)}
                  >
                    Book Ticket
                  </button>
                  <button
                    className="py-2 px-4 bg-blue-600 text-white rounded-md"
                    onClick={() => handleShareAttraction(attraction)}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No attractions available.
          </p>
        )}
      </div>
    </div>
  );
};

export default AttractionsCard;
