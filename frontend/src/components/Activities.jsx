/** @format */

import { useState, useEffect } from "react";
import axios from "axios";

const ActivitiesComponent = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    date: "",
    time: "",
    location: {
      type: "Point",
      coordinates: ["", ""], // Placeholder for longitude and latitude
    },
    price: "",
    priceRange: "",
    category: "",
    tags: [],
    specialDiscounts: "",
    bookingOpen: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editActivityId, setEditActivityId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null); // To store selected activity for viewing

  // Fetch all activities on component mount
  useEffect(() => {
    const fetchActivities = async () => {
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
          "http://localhost:3000/activities/",
          config
        );
        setActivities(response.data.activities || response.data); // Adjust based on your response structure
      } catch (error) {
        console.error("Failed to fetch activities", error);
      }
    };
    fetchActivities();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle array input for tags
    if (name === "tags") {
      setNewActivity({
        ...newActivity,
        [name]: value.split(",").map((item) => item.trim()), // Convert comma-separated input to array
      });
    } else if (name.startsWith("coordinates")) {
      const index = name.split(".")[1]; // Get index (0 for longitude, 1 for latitude)
      setNewActivity((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          coordinates: [
            index === "0" ? value : prevState.location.coordinates[0],
            index === "1" ? value : prevState.location.coordinates[1],
          ],
        },
      }));
    } else if (name === "bookingOpen") {
      setNewActivity({ ...newActivity, [name]: e.target.checked });
    } else {
      setNewActivity({ ...newActivity, [name]: value });
    }
  };

  // Create or Update Activity
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please login again.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (isEditing) {
        // Update activity
        await axios.put(
          `http://localhost:3000/activities/${editActivityId}`,
          newActivity,
          config
        );
        setIsEditing(false);
        setEditActivityId(null);
      } else {
        // Create a new activity
        await axios.post(
          "http://localhost:3000/activities/",
          newActivity,
          config
        );
      }
      // Refresh the activities list
      const response = await axios.get(
        "http://localhost:3000/activities/",
        config
      );
      setActivities(response.data.activities || response.data); // Adjust based on your response structure
      resetForm(); // Reset form
    } catch (error) {
      console.error("Failed to save activity", error);
    }
  };

  const resetForm = () => {
    setNewActivity({
      date: "",
      time: "",
      location: {
        type: "Point",
        coordinates: ["", ""],
      },
      price: "",
      priceRange: "",
      category: "",
      tags: [],
      specialDiscounts: "",
      bookingOpen: false,
    });
  };

  // Edit an activity
  const handleEdit = (activity) => {
    setNewActivity(activity);
    setIsEditing(true);
    setEditActivityId(activity._id);
  };

  // Delete an activity
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please login again.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.delete(`http://localhost:3000/activities/${id}`, config);
      setActivities(activities.filter((activity) => activity._id !== id));
      console.log("Activity deleted:", id);
    } catch (error) {
      console.error("Failed to delete activity", error);
    }
  };

  // View activity details
  const handleView = (activity) => {
    setSelectedActivity(activity);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Activities</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        {/* Form fields for creating/updating activities */}
        <div className="mb-4">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={newActivity.date}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={newActivity.time}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Location Coordinates</label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="coordinates.0"
              placeholder="Longitude"
              value={newActivity.location.coordinates[0]}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="coordinates.1"
              placeholder="Latitude"
              value={newActivity.location.coordinates[1]}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="mb-4">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={newActivity.price}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Price Range</label>
          <input
            type="text"
            name="priceRange"
            value={newActivity.priceRange}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={newActivity.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={newActivity.tags.join(", ")} // Join for display
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Special Discounts</label>
          <input
            type="text"
            name="specialDiscounts"
            value={newActivity.specialDiscounts}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>
            <input
              type="checkbox"
              name="bookingOpen"
              checked={newActivity.bookingOpen}
              onChange={handleInputChange}
            />
            Booking Open
          </label>
        </div>
        <div className="mb-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {isEditing ? "Update Activity" : "Create Activity"}
          </button>
        </div>
      </form>

      {/* List of activities */}
      <div>
        <h3 className="text-xl mb-4">All Activities</h3>
        {activities.length > 0 ? (
          <ul>
            {activities.map((activity) => (
              <li key={activity._id} className="border-b py-2">
                <div>
                  <strong>{activity.category}</strong> - {activity.date} at{" "}
                  {activity.time}
                  <button
                    onClick={() => handleView(activity)}
                    className="ml-4 text-blue-500"
                  >
                    See Activity
                  </button>
                  <button
                    onClick={() => handleEdit(activity)}
                    className="ml-2 text-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(activity._id)}
                    className="ml-2 text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities available.</p>
        )}
      </div>

      {/* Selected Activity Details */}
      {selectedActivity && (
        <div className="mt-6 p-4 border border-gray-300">
          <h4 className="text-lg">Activity Details</h4>
          <p>
            <strong>Date:</strong> {selectedActivity.date}
          </p>
          <p>
            <strong>Time:</strong> {selectedActivity.time}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {selectedActivity.location.coordinates.join(", ")}
          </p>
          <p>
            <strong>Price:</strong> {selectedActivity.price}
          </p>
          <p>
            <strong>Price Range:</strong> {selectedActivity.priceRange}
          </p>
          <p>
            <strong>Category:</strong> {selectedActivity.category}
          </p>
          <p>
            <strong>Tags:</strong> {selectedActivity.tags.join(", ")}
          </p>
          <p>
            <strong>Special Discounts:</strong>{" "}
            {selectedActivity.specialDiscounts}
          </p>
          <p>
            <strong>Booking Open:</strong>{" "}
            {selectedActivity.bookingOpen ? "Yes" : "No"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivitiesComponent;
