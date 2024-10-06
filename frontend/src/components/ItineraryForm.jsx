// src/components/ItineraryForm.jsx
import React, { useState, useEffect } from 'react';

const ItineraryForm = ({ onSubmit, existingItinerary }) => {
    const [title, setTitle] = useState('');
    const [activities, setActivities] = useState('');
    const [locations, setLocations] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (existingItinerary) {
            setTitle(existingItinerary.title);
            setActivities(existingItinerary.activities);
            setLocations(existingItinerary.locations);
            setDateRange(existingItinerary.dateRange);
            setTags(existingItinerary.tags);
        }
    }, [existingItinerary]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, activities, locations, dateRange, tags });
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setActivities('');
        setLocations('');
        setDateRange('');
        setTags('');
    };

    return (
        <form onSubmit={handleSubmit} className="itinerary-form">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <textarea
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                placeholder="Activities"
                required
            />
            <textarea
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                placeholder="Locations"
                required
            />
            <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="Date Range"
                required
            />
            <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default ItineraryForm;