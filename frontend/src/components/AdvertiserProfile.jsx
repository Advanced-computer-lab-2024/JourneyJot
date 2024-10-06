// src/components/AdvertiserProfile.jsx
import React, { useEffect, useState } from 'react';
import { fetchAdvertiserById } from '../api';
import AdvertiserForm from './AdvertiserForm';

const AdvertiserProfile = ({ id, onBack }) => {
    const [advertiser, setAdvertiser] = useState(null);

    useEffect(() => {
        const fetchAdvertiser = async () => {
            try {
                const data = await fetchAdvertiserById(id);
                setAdvertiser(data);
            } catch (error) {
                console.error("Error fetching advertiser:", error);
            }
        };
        fetchAdvertiser();
    }, [id]);

    return (
        <div className="container">
            {advertiser ? (
                <>
                    <h2>{advertiser.companyName}</h2>
                    <p><strong>Website:</strong> {advertiser.website}</p>
                    <p><strong>Hotline:</strong> {advertiser.hotline}</p>
                    <p><strong>Profile:</strong> {advertiser.companyProfile}</p>
                    <button onClick={onBack}>Back</button>
                    <AdvertiserForm advertiser={advertiser} onSubmit={onBack} />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default AdvertiserProfile;