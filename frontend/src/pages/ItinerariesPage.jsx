import React, { useEffect, useState } from 'react';
import { fetchItineraries } from '../api';
import ItineraryForm from '../components/ItineraryForm';
import ItineraryList from '../components/ItineraryList';

const ItinerariesPage = () => {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const loadItineraries = async () => {
      const fetchedItineraries = await fetchItineraries();
      setItineraries(fetchedItineraries);
    };
    loadItineraries();
  }, []);

  const handleItineraryAdded = (newItinerary) => {
    setItineraries((prev) => [...prev, newItinerary]);
  };

  return (
    <div>
      <h1>Itineraries</h1>
      <ItineraryForm onItineraryAdded={handleItineraryAdded} />
      <ItineraryList itineraries={itineraries} />
    </div>
  );
};

export default ItinerariesPage;