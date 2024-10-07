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
  const [tag, setTag] = useState(""); // State for historical places filtering by tag

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
      const response = await axios.get("http://localhost:5000/activities");
      setActivities(response.data);
      setFilteredActivities(response.data); // Initialize with all activities
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchItineraries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/itineraries");
      setItineraries(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  const fetchHistoricalPlaces = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/historical-places"
      );
      setHistoricalPlaces(response.data);
      setFilteredHistoricalPlaces(response.data); // Initialize with all historical places
    } catch (error) {
      console.error("Error fetching historical places:", error);
    }
  };

  // Filter Activities based on selected filters
  useEffect(() => {
    filterAndSortActivities();
  }, [budget, selectedDate, category, rating, sortBy, activities]);

  // Filter Historical Places based on selected tag
  useEffect(() => {
    filterHistoricalPlaces();
  }, [tag, historicalPlaces]);

  const filterAndSortActivities = () => {
    let filtered = activities;

    // Filtering logic
    if (budget) {
      filtered = filtered.filter(
        (activity) => activity.price <= parseInt(budget)
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (activity) => new Date(activity.date) >= new Date(selectedDate)
      );
    }

    if (category) {
      filtered = filtered.filter((activity) => activity.category === category);
    }

    if (rating) {
      filtered = filtered.filter(
        (activity) => activity.rating >= parseFloat(rating)
      );
    }

    // Sorting logic
    if (sortBy === "price") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredActivities(filtered);
  };

  const filterHistoricalPlaces = () => {
    let filtered = historicalPlaces;

    if (tag) {
      filtered = filtered.filter(
        (place) => place.tags && place.tags.includes(tag) // Adjust this according to your data structure
      );
    }

    setFilteredHistoricalPlaces(filtered);
  };

  // Sort Itineraries
  const sortItineraries = (itineraries) => {
    if (sortBy === "price") {
      return itineraries.sort((a, b) => a.price - b.price);
    } else if (sortBy === "rating") {
      return itineraries.sort((a, b) => b.rating - a.rating);
    }
    return itineraries;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Tourist Guest - Upcoming Activities and Places
      </h1>

      {/* Filters and Sorting Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Budget Filter */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Budget (Max Price)
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter max price"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">All Categories</option>
            <option value="concert">Concert</option>
            <option value="comedy">Stand-up Comedy</option>
            <option value="party">Party</option>
            <option value="bazaar">Bazaars</option>
            <option value="exhibition">Exhibitions</option>
            <option value="sports">Sports Matches</option>
            <option value="parks">Parks</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Minimum Rating
          </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter rating (1-5)"
            min="1"
            max="5"
            step="0.1"
          />
        </div>
      </div>

      {/* Sorting Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">No Sorting</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Activities Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Filtered and Sorted Activities
        </h2>
        {filteredActivities.length === 0 ? (
          <p>No activities available based on the filters.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map((activity) => (
              <li
                key={activity._id}
                className="border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="font-bold text-lg text-gray-800">
                  {activity.name}
                </h3>
                <p className="text-gray-600">{activity.description}</p>
                <p className="text-gray-500">Date: {activity.date}</p>
                <p className="text-gray-500">Price: ${activity.price}</p>
                <p className="text-gray-500">Rating: {activity.rating} / 5</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Itineraries Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Itineraries</h2>
        {itineraries.length === 0 ? (
          <p>No itineraries available.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortItineraries(itineraries).map((itinerary) => (
              <li
                key={itinerary._id}
                className="border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="font-bold text-lg text-gray-800">
                  {itinerary.name}
                </h3>
                <p className="text-gray-600">{itinerary.description}</p>
                <p className="text-gray-500">Duration: {itinerary.duration}</p>
                <p className="text-gray-500">Price: ${itinerary.price}</p>
                <p className="text-gray-500">Rating: {itinerary.rating} / 5</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Itinerary Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Budget Filter */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Itinerary Budget (Max Price)
          </label>
          <input
            type="number"
            value={itineraryBudget}
            onChange={(e) => setItineraryBudget(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter max price"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Itinerary Date
          </label>
          <input
            type="date"
            value={itineraryDate}
            onChange={(e) => setItineraryDate(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Preferences Filter */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Preferences
          </label>
          <select
            value={itineraryPreference}
            onChange={(e) => setItineraryPreference(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">All Preferences</option>
            <option value="historic areas">Historic Areas</option>
            <option value="beaches">Beaches</option>
            <option value="family-friendly">Family-friendly</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Language</label>
          <input
            type="text"
            value={itineraryLanguage}
            onChange={(e) => setItineraryLanguage(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter preferred language"
          />
        </div>
      </div>

      {/* Historical Places Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Historical Places & Museums
        </h2>
        {/* Tag Filter */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Filter by Tag
          </label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter tag"
          />
        </div>
        {filteredHistoricalPlaces.length === 0 ? (
          <p>No historical places available based on the tag.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistoricalPlaces.map((place) => (
              <li
                key={place._id}
                className="border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="font-bold text-lg text-gray-800">
                  {place.name}
                </h3>
                <p className="text-gray-600">{place.description}</p>
                <p className="text-gray-500">Location: {place.location}</p>
                <p className="text-gray-500">
                  Opening Hours: {place.openingHours}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TouristGuest;
