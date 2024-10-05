import React from 'react';

const AdvertiserList = ({ advertisers }) => (
  <ul>
    {advertisers.map((advertiser) => (
      <li key={advertiser._id}>
        {advertiser.companyName} - {advertiser.website} - {advertiser.hotline}
      </li>
    ))}
  </ul>
);

export default AdvertiserList;