// src/pages/CreateTourGuidePage.jsx
import React from 'react';
import TourGuideForm from '../components/TourGuideForm';

const CreateTourGuidePage = ({ onFormSubmit }) => {
    return (
        <div>
            <h1>Create Tour Guide</h1>
            <TourGuideForm onFormSubmit={onFormSubmit} />
        </div>
    );
};

export default CreateTourGuidePage;