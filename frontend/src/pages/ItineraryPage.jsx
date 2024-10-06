// src/pages/ItineraryPage.jsx
import React, { useState } from 'react';
import ItineraryForm from '../components/ItineraryForm';
import ItineraryList from '../components/ItineraryList';

const ItineraryPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [editingItinerary, setEditingItinerary] = useState(null);
    let nextId = 1;

    const handleCreateOrUpdate = (newItinerary) => {
        if (editingItinerary) {
            setItineraries(itineraries.map(it => (it.id === editingItinerary.id ? { ...newItinerary, id: editingItinerary.id } : it)));
        } else {
            setItineraries([...itineraries, { ...newItinerary, id: nextId++ }]);
        }
        setEditingItinerary(null);
    };

    const handleDelete = (id) => {
        setItineraries(itineraries.filter(it => it.id !== id));
    };

    const handleEdit = (itinerary) => {
        setEditingItinerary(itinerary);
    };

    return (
        <div className="container">
            <h1>Itinerary Management</h1>
            <ItineraryForm onSubmit={handleCreateOrUpdate} existingItinerary={editingItinerary} />
            <ItineraryList itineraries={itineraries} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
    );
};

export default ItineraryPage;