import React, { useState } from 'react';
import { createAdvertiser } from '../api';

const AdvertiserForm = ({ onAdvertiserAdded }) => {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [hotline, setHotline] = useState('');
  const [companyProfile, setCompanyProfile] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAdvertiser = { companyName, website, hotline, companyProfile, accepted: false };
    const savedAdvertiser = await createAdvertiser(newAdvertiser);
    onAdvertiserAdded(savedAdvertiser);
    setCompanyName('');
    setWebsite('');
    setHotline('');
    setCompanyProfile('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
      <input type="url" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} required />
      <input type="text" placeholder="Hotline" value={hotline} onChange={(e) => setHotline(e.target.value)} required />
      <textarea placeholder="Company Profile" value={companyProfile} onChange={(e) => setCompanyProfile(e.target.value)} />
      <button type="submit">Add Advertiser</button>
    </form>
  );
};

export default AdvertiserForm;