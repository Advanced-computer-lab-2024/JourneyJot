// src/components/AdvertiserForm.jsx
import React, { useState } from 'react';
import { createAdvertiser, updateAdvertiser } from '../api'; // Import createAdvertiser here


const AdvertiserForm = ({ advertiser, onSubmit }) => {
    const [companyName, setCompanyName] = useState(advertiser ? advertiser.companyName : '');
    const [website, setWebsite] = useState(advertiser ? advertiser.website : '');
    const [hotline, setHotline] = useState(advertiser ? advertiser.hotline : '');
    const [companyProfile, setCompanyProfile] = useState(advertiser ? advertiser.companyProfile : '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAdvertiser = { companyName, website, hotline, companyProfile };
        if (advertiser) {
            await updateAdvertiser(advertiser._id, newAdvertiser);
        } else {
            await createAdvertiser(newAdvertiser);
        }
        onSubmit();
        setCompanyName('');
        setWebsite('');
        setHotline('');
        setCompanyProfile('');
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2>{advertiser ? 'Update Advertiser' : 'Create Advertiser'}</h2>
                <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Hotline"
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Company Profile"
                    value={companyProfile}
                    onChange={(e) => setCompanyProfile(e.target.value)}
                    rows="4"
                />
                <button type="submit">{advertiser ? 'Update' : 'Create'} Advertiser</button>
            </form>
        </div>
    );
};

export default AdvertiserForm;