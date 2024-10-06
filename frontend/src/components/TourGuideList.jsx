// src/components/TourGuideList.jsx
import React from 'react';

const TourGuideList = ({ guides, onEdit }) => {
    return (
        <ul>
            {guides.map((guide) => (
                <li key={guide._id}>
                    <div>
                        <h3>{guide.name}</h3>
                        <p>Mobile: {guide.mobile}</p>
                        <p>Experience: {guide.experience} years</p>
                        <p>Previous Work: {guide.previousWork}</p>
                        <p>Accepted: {guide.accepted ? 'Yes' : 'No'}</p>
                    </div>
                    <button onClick={() => onEdit(guide)}>Edit</button>
                </li>
            ))}
        </ul>
    );
};

export default TourGuideList;