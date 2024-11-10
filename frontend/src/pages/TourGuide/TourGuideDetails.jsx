import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to get the id from the URL
import { FaStar, FaRegStar } from "react-icons/fa"; // Importing the star icons

const TourGuideDetails = () => {
  const { id } = useParams(); // Extract the 'id' from the URL
  const [tourGuide, setTourGuide] = useState(null); // State to store tour guide data
  const [loading, setLoading] = useState(true); // State for loading state
  const [error, setError] = useState(null); // State for any errors

  useEffect(() => {
    const fetchTourGuide = async () => {
      try {
        // Fetching the tour guide details using the id from the URL
        const response = await axios.get(
          `http://localhost:3000/tour-guides/profile/${id}` // Assuming you use the id to fetch the profile
        );
        setTourGuide(response.data); // Set fetched data
        setLoading(false);
      } catch (error) {
        setError(error.message); // Set error message
        setLoading(false);
      }
    };

    fetchTourGuide();
  }, [id]); // Use the 'id' from the URL, re-run when the id changes

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        Error: {error}
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Tour Guide Profile
      </h1>

      {/* Tour Guide Information */}
      <div className="flex justify-center">
        {tourGuide.image ? (
          <img
            src={tourGuide.image}
            alt="Tour Guide"
            className="w-32 h-32 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-bold">
            TG
          </div>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">{tourGuide.name}</h2>
        <p className="text-gray-600">{tourGuide.mobileNumber}</p>
        <p className="text-gray-600">
          {tourGuide.yearsOfExperience} years of experience
        </p>
        <p className="text-gray-600">
          {tourGuide.previousWork || "No previous work provided"}
        </p>
      </div>

      {/* Ratings Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Ratings</h3>
        <div>
          {tourGuide.ratings.length === 0 ? (
            <p>No ratings yet</p>
          ) : (
            tourGuide.ratings.map((rating, index) => (
              <div key={index} className="border-b border-gray-300 pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">User:</span>
                  <span>
                    {rating.userId ? rating.userId.username : "Anonymous"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Rating:</span>
                  <div className="flex">{renderStars(rating.rating || 0)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Comment:</span>
                  <span>{rating.comment || "No comment"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* File Link (if exists) */}
      {tourGuide.file && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Additional File
          </h3>
          <a
            href={tourGuide.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            Download the file
          </a>
        </div>
      )}
    </div>
  );
};

export default TourGuideDetails;
