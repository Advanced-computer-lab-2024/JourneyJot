import React, { useEffect, useState } from 'react';
import { fetchTourGuides } from '../api';
import TourGuideForm from '../components/TourGuideForm';
import TourGuideList from '../components/TourGuideList';

const TourGuidesPage = () => {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    const loadGuides = async () => {
      const fetchedGuides = await fetchTourGuides();
      setGuides(fetchedGuides);
    };
    loadGuides();
  }, []);

  const handleGuideAdded = (newGuide) => {
    setGuides((prev) => [...prev, newGuide]);
  };

  return (
    <div>
      <h1>Tour Guides</h1>
      <TourGuideForm onGuideAdded={handleGuideAdded} />
      <TourGuideList guides={guides} />
    </div>
  );
};

export default TourGuidesPage;