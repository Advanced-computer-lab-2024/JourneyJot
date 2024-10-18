import React from "react";
import axios from "axios";

const ActivitiesCard = ({
  activities = [],
  isAdvertiser = false,
  onDelete,
}) => {
  const handleEdit = (activityId) => {
    // Logic for editing the activity (e.g., navigate to edit page)
    alert(`Edit activity with ID: ${activityId}`);
  };

  const handleDelete = async (activityId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/activities/${activityId}`
      );
      onDelete(activityId);
      console.log("Activity deleted:", response.data);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div
            key={activity._id}
            className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex flex-col h-full space-y-4">
              {/* Date */}
              <div className="text-gray-700">
                <span className="font-semibold">Date: </span>
                {new Date(activity.date).toLocaleDateString()}{" "}
                {/* Format the date */}
              </div>

              {/* Time */}
              <div className="text-gray-700">
                <span className="font-semibold">Time: </span>
                {activity.time}
              </div>

              {/* Location */}
              <div className="text-gray-700">
                <span className="font-semibold">Location: </span>
                {activity.location.coordinates.join(", ")}{" "}
                {/* Display coordinates */}
              </div>

              {/* Price */}
              <div className="text-gray-700">
                <span className="font-semibold">Price: </span>${activity.price}
              </div>

              {/* Price Range */}
              {activity.priceRange && ( // Display price range only if it exists
                <div className="text-gray-700">
                  <span className="font-semibold">Price Range: </span>
                  {activity.priceRange}
                </div>
              )}

              {/* Tags */}
              {activity.tags && (
                <div className="text-gray-700">
                  <span className="font-semibold">Tags: </span>
                  {activity.tags.name}
                </div>
              )}

              {/* Category */}
              {activity.category && (
                <div className="text-gray-700">
                  <span className="font-semibold">Category: </span>
                  {activity.category.name}
                </div>
              )}

              {/* Special Discounts */}
              {activity.specialDiscounts && ( // Display special discounts only if they exist
                <div className="text-gray-700">
                  <span className="font-semibold">Special Discounts: </span>
                  {activity.specialDiscounts}
                </div>
              )}

              {/* Booking Open */}
              <div className="text-gray-700">
                <span className="font-semibold">Booking Open: </span>
                {activity.bookingOpen ? "Yes" : "No"}
              </div>

              {/* Rating */}
              {activity.rating && ( // Display rating only if it exists
                <div className="text-gray-700">
                  <span className="font-semibold">Rating: </span>
                  {activity.rating} / 5
                </div>
              )}

              {/* Edit and Delete buttons */}
              {isAdvertiser && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(activity._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(activity._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No activities available.
        </p>
      )}
    </div>
  );
};

export default ActivitiesCard;
