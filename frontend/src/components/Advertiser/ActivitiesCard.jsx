import React, { useState } from "react";
import axios from "axios";

const ActivitiesCard = ({
  activities = [],
  isAdvertiser = false,
  onDelete,
  fetchActivities,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  const handleEdit = (activity) => {
    setCurrentActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (activityId) => {
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
      const response = await axios.delete(
        `http://localhost:3000/activities/${activityId}`,
        config
      );
      onDelete(activityId);
      console.log("Activity deleted:", response.data);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const handleUpdateActivity = async (updatedActivity) => {
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
      await axios.put(
        `http://localhost:3000/activities/${updatedActivity._id}`,
        updatedActivity,
        config
      );
      setIsEditModalOpen(false);
      fetchActivities();
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity._id}
              className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex flex-col h-full space-y-4 text-left">
                <ul className="list-disc list-inside space-y-2">
                  <li className="text-gray-700">
                    <span className="font-semibold">Date: </span>
                    {new Date(activity.date).toLocaleDateString()}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Time: </span>
                    {activity.time}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Location: </span>
                    {activity.location.coordinates.join(", ")}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Price: </span>$
                    {activity.price}
                  </li>
                  {activity.priceRange && (
                    <li className="text-gray-700">
                      <span className="font-semibold">Price Range: </span>
                      {activity.priceRange}
                    </li>
                  )}
                  {activity.tags && (
                    <li className="text-gray-700">
                      <span className="font-semibold">Tags: </span>
                      {activity.tags.name}
                    </li>
                  )}
                  {activity.category && (
                    <li className="text-gray-700">
                      <span className="font-semibold">Category: </span>
                      {activity.category.name}
                    </li>
                  )}
                  {activity.specialDiscounts && (
                    <li className="text-gray-700">
                      <span className="font-semibold">Special Discounts: </span>
                      {activity.specialDiscounts}
                    </li>
                  )}
                  <li className="text-gray-700">
                    <span className="font-semibold">Booking Open: </span>
                    {activity.bookingOpen ? "Yes" : "No"}
                  </li>
                  {activity.rating && (
                    <li className="text-gray-700">
                      <span className="font-semibold">Rating: </span>
                      {activity.rating} / 5
                    </li>
                  )}
                </ul>

                {/* Edit and Delete buttons */}
                {isAdvertiser && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(activity)}
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

      {/* Edit Modal */}
      {isEditModalOpen && currentActivity && (
        <EditActivityModal
          activity={currentActivity}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateActivity}
        />
      )}
    </div>
  );
};

const EditActivityModal = ({ activity, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    date: activity.date,
    time: activity.time,
    price: activity.price,
    priceRange: activity.priceRange,
    category: activity.category,
    tags: activity.tags,
    specialDiscounts: activity.specialDiscounts,
    bookingOpen: activity.bookingOpen,
    rating: activity.rating,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...activity, ...formData }); // Merging original activity with updated form data
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Edit Activity</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields for editing activity */}
          <label className="block mb-2">
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Time:
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Price Range:
            <input
              type="text"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Category:
            <input
              type="text"
              name="category"
              value={formData.category.name}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Tags:
            <input
              type="text"
              name="tags"
              value={formData.tags.name}
              onChange={(e) =>
                handleChange({
                  target: { name: "tags", value: e.target.value.split(",") },
                })
              }
              className="border rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Special Discounts:
            <input
              type="text"
              name="specialDiscounts"
              value={formData.specialDiscounts}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Booking Open:
            <select
              name="bookingOpen"
              value={formData.bookingOpen ? "yes" : "no"}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "bookingOpen",
                    value: e.target.value === "yes",
                  },
                })
              }
              className="border rounded p-2 w-full"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          <label className="block mb-2">
            Rating:
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              className="border rounded p-2 w-full"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivitiesCard;
