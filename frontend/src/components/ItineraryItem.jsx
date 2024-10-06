// src/components/ItineraryItem.jsx
import React from 'react';

const ItineraryItem = ({ itinerary, onDelete, onEdit }) => {
    return (
        <div className="itinerary-item">
            <h3>{itinerary.title}</h3>
            <p><strong>Activities:</strong> {itinerary.activities}</p>
            <p><strong>Locations:</strong> {itinerary.locations}</p>
            <p><strong>Date Range:</strong> {itinerary.dateRange}</p>
            <p><strong>Tags:</strong> {itinerary.tags}</p>
            <button onClick={() => onEdit(itinerary)}>Edit</button>
            <button onClick={() => onDelete(itinerary.id)}>Delete</button>
        </div>
    );
};

export default ItineraryItem;