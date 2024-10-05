import React from 'react';

const TourGuideList = ({ guides }) => (
  <ul>
    {guides.map((guide) => (
      <li key={guide._id}>
        {guide.name} - {guide.mobile} - {guide.experience} years
      </li>
    ))}
  </ul>
);

export default TourGuideList;