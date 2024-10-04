import React, { useState, useEffect } from 'react';
import { createItinerary, fetchTourGuides } from '../api';

const ItineraryForm = ({ onItineraryAdded }) => {
  const [tourGuide, setTourGuide] = useState('');
  const [title, setTitle] = useState('');
  const [activities, setActivities] = useState([{ description: '', location: '', date: '' }]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [tags, setTags] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);

  useEffect(() => {
    const loadTourGuides = async () => {
      const fetchedTourGuides = await fetchTourGuides();
      setTourGuides(fetchedTourGuides);
    };
    loadTourGuides();
  }, []);

  const handleActivityChange = (index, field, value) => {
    const newActivities = [...activities];
    newActivities[index][field] = value;
    setActivities(newActivities);
  };

  const handleAddActivity = () => {
    setActivities([...activities, { description: '', location: '', date: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItinerary = { tourGuide, title, activities, dateRange, tags };
    const savedItinerary = await createItinerary(newItinerary);
    onItineraryAdded(savedItinerary);
    setTourGuide('');
    setTitle('');
    setActivities([{ description: '', location: '', date: '' }]);
    setDateRange({ start: '', end: '' });
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={tourGuide} onChange={(e) => setTourGuide(e.target.value)} required>
        <option value="">Select Tour Guide</option>
        {tourGuides.map((guide) => (
          <option key={guide._id} value={guide._id}>{guide.name}</option>
        ))}
      </select>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      {activities.map((activity, index) => (
        <div key={index}>
          <input type="text" placeholder="Description" value={activity.description} onChange={(e) => handleActivityChange(index, 'description', e.target.value)} required />
          <input type="text" placeholder="Location" value={activity.location} onChange={(e) => handleActivityChange(index, 'location', e.target.value)} required />
          <input type="date" value={activity.date} onChange={(e) => handleActivityChange(index, 'date', e.target.value)} required />
        </div>
      ))}
      <button type="button" onClick={handleAddActivity}>Add Activity</button>
      <input type="date" placeholder="Start Date" value={dateRange.start} onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))} required />
      <input type="date" placeholder="End Date" value={dateRange.end} onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))} required />
      <input type="text" placeholder="Tags (comma separated)" value={tags.join(', ')} onChange={(e) => setTags(e.target.value.split(','))} />
      <button type="submit">Add Itinerary</button>
    </form>
  );
};

export default ItineraryForm;