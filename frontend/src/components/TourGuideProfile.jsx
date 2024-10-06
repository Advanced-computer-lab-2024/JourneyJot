// src/components/TourGuideProfile.jsx
import React from 'react';

const TourGuideProfile = ({ guide }) => {
    if (!guide) return <div>Select a tour guide to see details.</div>;

    return (
        <div>
            <h2>{guide.name}</h2>
            <p>Mobile: {guide.mobile}</p>
            <p>Experience: {guide.experience} years</p>
            <p>Previous Work: {guide.previousWork}</p>
            <p>Accepted: {guide.accepted ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default TourGuideProfile;