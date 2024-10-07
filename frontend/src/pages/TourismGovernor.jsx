import React, { useState, useEffect } from "react";
import axios from "axios";

const TourismGovernor = () => {
  const [places, setPlaces] = useState([]); // List of museums/historical places
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    openingHours: "",
    foreignPrice: "",
    nativePrice: "",
    studentPrice: "",
    image: "",
  }); // Form data for add/edit
  const [editingId, setEditingId] = useState(null); // ID of the place being edited

  // Fetch places on component mount
  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tourism");
      setPlaces(response.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add or Update Place
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update existing place
      await axios.put(`http://localhost:5000/tourism/${editingId}`, formData);
    } else {
      // Create new place
      await axios.post("http://localhost:5000/tourism", formData);
    }
    fetchPlaces();
    resetForm();
  };

  // Edit Place
  const handleEdit = (place) => {
    setEditingId(place._id);
    setFormData({
      name: place.name,
      description: place.description,
      location: place.location,
      openingHours: place.openingHours,
      foreignPrice: place.foreignPrice,
      nativePrice: place.nativePrice,
      studentPrice: place.studentPrice,
      image: place.image,
    });
  };

  // Delete Place
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/tourism/${id}`);
    fetchPlaces();
  };

  // Reset form after submit
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      location: "",
      openingHours: "",
      foreignPrice: "",
      nativePrice: "",
      studentPrice: "",
      image: "",
    });
  };

  return (
    <div>
      <h1>Tourism Governor - Museums & Historical Places:</h1>

      {/* Form for adding or editing */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="openingHours"
          placeholder="Opening Hours"
          value={formData.openingHours}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="foreignPrice"
          placeholder="Ticket Price (Foreigners)"
          value={formData.foreignPrice}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="nativePrice"
          placeholder="Ticket Price (Natives)"
          value={formData.nativePrice}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="studentPrice"
          placeholder="Ticket Price (Students)"
          value={formData.studentPrice}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editingId ? "Update" : "Create "} Place</button>
        {editingId && <button onClick={resetForm}>Cancel Edit</button>}
      </form>

      {/* Display list of museums and historical places */}
      <ul>
        {places.map((place) => (
          <li key={place._id}>
            <h2>{place.name}</h2>
            <p>{place.description}</p>
            <p>Location: {place.location}</p>
            <p>Opening Hours: {place.openingHours}</p>
            <p>
              Ticket Prices: Foreigner - ${place.foreignPrice}, Native - $
              {place.nativePrice}, Student - ${place.studentPrice}
            </p>
            <img
              src={place.image}
              alt={place.name}
              style={{ width: "200px", height: "150px" }}
            />
            <button onClick={() => handleEdit(place)}>Edit</button>
            <button onClick={() => handleDelete(place._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TourismGovernor;
