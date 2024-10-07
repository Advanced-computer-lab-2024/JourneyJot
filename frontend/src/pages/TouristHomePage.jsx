import React from "react";
import { Link } from "react-router-dom";

const TouristHomePage = () => {
  return (
    <div>
      <Link to={"profile"}>
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-700 transition duration-200">
          My Profile
        </button>
      </Link>
    </div>
  );
};

export default TouristHomePage;
