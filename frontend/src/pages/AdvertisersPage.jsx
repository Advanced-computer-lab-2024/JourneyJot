// src/pages/AdvertiserPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchAdvertisers } from '../api';
import AdvertiserForm from '../components/AdvertiserForm';
import AdvertiserList from '../components/AdvertiserList';

const AdvertiserPage = () => {
    const [advertisers, setAdvertisers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAdvertiser, setCurrentAdvertiser] = useState(null);

    const loadAdvertisers = async () => {
        try {
            const data = await fetchAdvertisers();
            setAdvertisers(data);
        } catch (error) {
            console.error("Error fetching advertisers:", error);
        }
    };

    useEffect(() => {
        loadAdvertisers();
    }, []);

    const handleEdit = (advertiser) => {
        setCurrentAdvertiser(advertiser);
        setIsEditing(true);
    };

    const handleBack = () => {
        setCurrentAdvertiser(null);
        setIsEditing(false);
        loadAdvertisers();
    };

    return (
        <div className="container">
            <h1>Advertisers</h1>
            {isEditing ? (
                <AdvertiserForm advertiser={currentAdvertiser} onSubmit={handleBack} />
            ) : (
                <>
                    <AdvertiserList advertisers={advertisers} onEdit={handleEdit} />
                    <button onClick={() => setIsEditing(true)}>Create New Advertiser</button>
                </>
            )}
        </div>
    );
};

export default AdvertiserPage;