import { useState, useEffect } from "react";
import axios from "axios";

const TouristGuest = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [filteredHistoricalPlaces, setFilteredHistoricalPlaces] = useState([]);

  // Filters state
  const [budget, setBudget] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [itineraryBudget, setItineraryBudget] = useState("");
  const [itineraryDate, setItineraryDate] = useState("");
  const [itineraryPreference, setItineraryPreference] = useState("");
  const [itineraryLanguage, setItineraryLanguage] = useState("");
  const [tag, setTag] = useState("");

  // Sorting state
  const [sortBy, setSortBy] = useState("");

  // Fetch Activities, Itineraries, and Historical Places
  useEffect(() => {
    fetchActivities();
    fetchItineraries();
    fetchHistoricalPlaces();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/activities");
      setActivities(response.data);
      setFilteredActivities(response.data); // Initialize with all activities
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchItineraries = async () => {
    try {
      const response = await axios.get("http://localhost:3000/itineraries");
      setItineraries(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  const fetchHistoricalPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:3000/attractions");
      setHistoricalPlaces(response.data);
      setFilteredHistoricalPlaces(response.data); // Initialize with all historical places
    } catch (error) {
      console.error("Error fetching historical places:", error);
    }
  };

  return <div></div>;
};

export default TouristGuest;
