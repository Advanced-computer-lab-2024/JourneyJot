import React from "react";
import { Link, useNavigate } from "react-router-dom";

const TouristHomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Link to={"profile"}>
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-700 transition duration-200">
          My Profile
        </button>
      </Link>

      <button
        onClick={() => navigate("/products")}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-700 transition duration-200"
      >
        Products
      </button>
    </div>
  );
};

export default TouristHomePage;
