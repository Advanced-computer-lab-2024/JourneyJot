import React, { useState } from 'react';
import { createTourGuide } from '../api';



const TourGuideForm = ({ onGuideAdded }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [experience, setExperience] = useState(0);
  const [previousWork, setPreviousWork] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newGuide = { 
        name, 
        mobile, 
        experience: Number(experience), // Ensure experience is a number
        previousWork, 
        accepted: false 
    };

    console.log('Submitting new guide:', newGuide); 

    try {
        const savedGuide = await createTourGuide(newGuide);
        onGuideAdded(savedGuide); // Callback function to handle the saved guide
        // Clear form fields
        setName('');
        setMobile('');
        setExperience(0);
        setPreviousWork('');
    } catch (error) {
        console.error('Error creating tour guide:', error.response ? error.response.data : error.message);
        // Optionally show an error message to the user
    }
};



  return (
     <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" required />
            <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Experience" required />
            <input type="text" value={previousWork} onChange={(e) => setPreviousWork(e.target.value)} placeholder="Previous Work" />
            <button type="submit">Add Tour Guide</button>
        </form>
  );
};

export default TourGuideForm;