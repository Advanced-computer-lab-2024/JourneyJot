// src/components/ItineraryList.jsx
import React from 'react';
import ItineraryItem from './ItineraryItem';

const ItineraryList = ({ itineraries, onDelete, onEdit }) => {
    return (
        <div>
            {itineraries.map((itinerary) => (
                <ItineraryItem
                    key={itinerary.id}
                    itinerary={itinerary}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export default ItineraryList;