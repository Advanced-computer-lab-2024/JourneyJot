// src/components/TourGuideForm.jsx
import React, { useState, useEffect } from 'react';
import { createTourGuide, updateTourGuide } from '../api';

const TourGuideForm = ({ guideToEdit, onGuideAdded, onGuideUpdated }) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [experience, setExperience] = useState(0);
    const [previousWork, setPreviousWork] = useState('');
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        if (guideToEdit) {
            setName(guideToEdit.name);
            setMobile(guideToEdit.mobile);
            setExperience(guideToEdit.experience);
            setPreviousWork(guideToEdit.previousWork);
            setAccepted(guideToEdit.accepted);
        }
    }, [guideToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newGuide = { name, mobile, experience, previousWork, accepted };
        if (guideToEdit) {
            const updatedGuide = await updateTourGuide(guideToEdit._id, newGuide);
            onGuideUpdated(updatedGuide);
        } else {
            const savedGuide = await createTourGuide(newGuide);
            onGuideAdded(savedGuide); // This will call the function passed as prop
        }
        // Reset form
        setName('');
        setMobile('');
        setExperience(0);
        setPreviousWork('');
        setAccepted(false);
    };

    return (
        <div className="container">
            <h2>{guideToEdit ? 'Edit Tour Guide' : 'Create Tour Guide'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" required />
                <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Years of Experience" required />
                <input type="text" value={previousWork} onChange={(e) => setPreviousWork(e.target.value)} placeholder="Previous Work" />
                <label>
                    Accepted:
                    <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                </label>
                <button type="submit">{guideToEdit ? 'Update' : 'Create'} Tour Guide</button>
            </form>
        </div>
    );
};

export default TourGuideForm;