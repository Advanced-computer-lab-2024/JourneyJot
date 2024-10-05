import React, { useState } from 'react';
import { createTourGuide } from '../api';



const TourGuideForm = ({ onGuideAdded }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [experience, setExperience] = useState(0);
  const [previousWork, setPreviousWork] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGuide = { name, mobile, experience, previousWork, accepted: false };
    const savedGuide = await createTourGuide(newGuide);
    onGuideAdded(savedGuide);
    setName('');
    setMobile('');
    setExperience(0);
    setPreviousWork('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
      <input type="number" placeholder="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} required />
      <input type="text" placeholder="Previous Work" value={previousWork} onChange={(e) => setPreviousWork(e.target.value)} />
      <button type="submit">Add Tour Guide</button>
    </form>
  );
};

export default TourGuideForm;