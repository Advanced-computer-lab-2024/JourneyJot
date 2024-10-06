// src/pages/TourGuideListPage.jsx
import React, { useEffect, useState } from "react";
import TourGuideForm from "../components/TourGuideForm"; // Ensure this matches the filename
import TourGuideList from "../components/TourGuideList"; // Ensure this matches the filename
import { fetchTourGuides } from "../api";

const TourGuideListPage = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [editingGuide, setEditingGuide] = useState(null);

  useEffect(() => {
    const loadTourGuides = async () => {
      const guides = await fetchTourGuides();
      setTourGuides(guides);
    };
    loadTourGuides();
  }, []);

  const handleGuideAdded = (newGuide) => {
    setTourGuides([...tourGuides, newGuide]);
  };

  const handleGuideUpdated = (updatedGuide) => {
    setTourGuides(tourGuides.map(guide => guide._id === updatedGuide._id ? updatedGuide : guide));
    setEditingGuide(null);
  };

  return (
    <div>
      <TourGuideForm onGuideAdded={handleGuideAdded} onGuideUpdated={handleGuideUpdated} guideToEdit={editingGuide} />
      <TourGuideList guides={tourGuides} onEdit={setEditingGuide} />
    </div>
  );
};

export default TourGuideListPage;