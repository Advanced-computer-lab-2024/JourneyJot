import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa"; // Importing the star icons

const CompletedActivityInfo = () => {
  // Get the 'id' from the URL using useParams
  const { id } = useParams();
  const [activity, setActivity] = useState(null); // State to store activity data
  const [loading, setLoading] = useState(true); // State for loading state
  const [error, setError] = useState(null); // State for any errors
  const [showRatings, setShowRatings] = useState(false); // State to toggle the ratings dropdown

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // Assuming you're passing the token in the Authorization header
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          `http://localhost:3000/activities/${id}`, // Make a GET request with the id
          config
        );
        setActivity(response.data); // Store the fetched activity data
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        setError(error.message); // Store any error message
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchActivity();
  }, [id]); // Re-run the effect when the 'id' changes

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>; // Show loading state while fetching data
  }

  if (error) {
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        Error: {error}
      </div>
    ); // Show error message if any error occurs
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />); // Filled star
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-300" />); // Empty star
      }
    }
    return stars;
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Activity Details
      </h1>

      {/* Activity attributes */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Activity Name:</span>
          <span>{activity.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Date:</span>
          <span>{new Date(activity.date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Time:</span>
          <span>{activity.time}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Location:</span>
          <span>
            {activity.location
              ? `${activity.location.coordinates[0]}, ${activity.location.coordinates[1]}`
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Price:</span>
          <span>${activity.price}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Price Range:</span>
          <span>{activity.priceRange || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Category:</span>
          <span>{activity.category ? activity.category.name : "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Special Discounts:</span>
          <span>{activity.specialDiscounts || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Booking Open:</span>
          <span>{activity.bookingOpen ? "Yes" : "No"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Rating:</span>
          <div className="flex">{renderStars(activity.rating || 0)}</div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Flagged:</span>
          <span>{activity.flagged ? "Yes" : "No"}</span>
        </div>
      </div>

      {/* Ratings dropdown */}
      <div className="relative">
        <div
          onClick={() => setShowRatings(!showRatings)}
          className="cursor-pointer text-blue-500 font-semibold"
        >
          {activity.ratings.length}{" "}
          {activity.ratings.length === 1 ? "Rating" : "Ratings"}
        </div>

        {showRatings && (
          <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-full max-h-48 overflow-y-auto">
            <div className="p-4">
              {activity.ratings.map((rating, index) => (
                <div
                  key={index}
                  className={`border-b border-gray-300 pb-4 ${
                    index !== activity.ratings.length - 1 ? "mb-4" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">User:</span>
                    <span>
                      {rating.userId ? rating.userId.username : "Anonymous"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Rating:</span>
                    <div className="flex">
                      {renderStars(rating.rating || 0)}{" "}
                      {/* Display stars for each rating */}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Comment:</span>
                    <span>{rating.comment || "No comment"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedActivityInfo;
