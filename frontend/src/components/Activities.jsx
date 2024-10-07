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
          "http://localhost:3000/activities",
          config
        );
        setActivities(response.data);
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
      setActivities(response.data);
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
      }); // Reset form
    } catch (error) {
      console.error("Failed to save activity", error);
    }
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
    } catch (error) {
      console.error("Failed to delete activity", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Activities</h2>

      <form onSubmit={handleSubmit} className="mb-6">
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
          <label>Location (Longitude)</label>
          <input
            type="text"
            name="coordinates.0"
            value={newActivity.location.coordinates[0]}
            onChange={handleInputChange}
            placeholder="Longitude"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Location (Latitude)</label>
          <input
            type="text"
            name="coordinates.1"
            value={newActivity.location.coordinates[1]}
            onChange={handleInputChange}
            placeholder="Latitude"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={newActivity.price}
            onChange={handleInputChange}
            placeholder="Price"
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
            placeholder="Price Range"
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
            placeholder="Category"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Tags</label>
          <input
            type="text"
            name="tags"
            value={newActivity.tags.join(", ")} // Convert array to string for display
            onChange={handleInputChange}
            placeholder="Tags (comma separated)"
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
            placeholder="Special Discounts"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Booking Open</label>
          <input
            type="checkbox"
            name="bookingOpen"
            checked={newActivity.bookingOpen}
            onChange={handleInputChange}
          />
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
              <li
                key={activity._id}
                className="mb-4 p-4 border border-gray-300 rounded"
              >
                <p>
                  <strong>Date:</strong> {activity.date}
                </p>
                <p>
                  <strong>Time:</strong> {activity.time}
                </p>
                <p>
                  <strong>Location:</strong> ({activity.location.coordinates[0]}
                  , {activity.location.coordinates[1]})
                </p>
                <p>
                  <strong>Price:</strong> {activity.price}
                </p>
                <p>
                  <strong>Price Range:</strong> {activity.priceRange}
                </p>
                <p>
                  <strong>Category:</strong> {activity.category}
                </p>
                <p>
                  <strong>Tags:</strong> {activity.tags.join(", ")}
                </p>
                <p>
                  <strong>Special Discounts:</strong>{" "}
                  {activity.specialDiscounts}
                </p>
                <p>
                  <strong>Booking Open:</strong>{" "}
                  {activity.bookingOpen ? "Yes" : "No"}
                </p>
                <button
                  onClick={() => handleEdit(activity)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(activity._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities available.</p>
        )}
      </div>
    </div>
  );
};

export default ActivitiesComponent;
