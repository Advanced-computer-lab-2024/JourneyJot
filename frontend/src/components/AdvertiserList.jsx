// src/components/AdvertiserList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdvertiserList = ({ advertisers, onEdit }) => {
    return (
        <div className="container">
            <h2>Advertisers</h2>
            <ul>
                {advertisers.map((advertiser) => (
                    <li key={advertiser._id}>
                        <Link to={`/advertiser/${advertiser._id}`} className="link">{advertiser.companyName}</Link>
                        <button onClick={() => onEdit(advertiser)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdvertiserList;