import React from 'react';

const ItineraryList = ({ itineraries }) => (
  <ul>
    {itineraries.map((itinerary) => (
      <li key={itinerary._id}>
        <strong>{itinerary.title}</strong> - Guided by {itinerary.tourGuide.name}
        <ul>
          {itinerary.activities.map((activity, index) => (
            <li key={index}>
              {activity.description} at {activity.location} on {new Date(activity.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

export default ItineraryList;