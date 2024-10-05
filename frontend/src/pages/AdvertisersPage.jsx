import React, { useEffect, useState } from 'react';
import { fetchAdvertisers } from '../api';
import AdvertiserForm from '../components/AdvertiserForm';
import AdvertiserList from '../components/AdvertiserList';

const AdvertisersPage = () => {
  const [advertisers, setAdvertisers] = useState([]);

  useEffect(() => {
    const loadAdvertisers = async () => {
      const fetchedAdvertisers = await fetchAdvertisers();
      setAdvertisers(fetchedAdvertisers);
    };
    loadAdvertisers();
  }, []);

  const handleAdvertiserAdded = (newAdvertiser) => {
    setAdvertisers((prev) => [...prev, newAdvertiser]);
  };

  return (
    <div>
      <h1>Advertisers</h1>
      <AdvertiserForm onAdvertiserAdded={handleAdvertiserAdded} />
      <AdvertiserList advertisers={advertisers} />
    </div>
  );
};

export default AdvertisersPage;