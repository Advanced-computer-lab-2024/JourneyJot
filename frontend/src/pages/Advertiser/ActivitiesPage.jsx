import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ActivitiesCard from "../../components/Advertiser/ActivitiesCard";

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/activities");
      console.log(response.data.activities);
      setActivities(response.data.activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = (activityId) => {
    setActivities((prevActivities) =>
      prevActivities.filter((activity) => activity._id !== activityId)
    );
  };

  return (
    <div>
      <ActivitiesCard
        activities={activities}
        isAdvertiser={true}
        onDelete={handleDelete}
        fetchActivities={fetchActivities}
      />
    </div>
  );
};

export default ActivitiesPage;
