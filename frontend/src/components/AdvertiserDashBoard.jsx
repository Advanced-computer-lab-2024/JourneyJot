/** @format */

import { Link, Route, Routes } from "react-router-dom";

const AdvertiserDashBoard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-xl font-bold">Advertiser Dashboard</h1>
          <div>
            <Link
              to="/advertiser-dashboard/profile"
              className="text-blue-600 hover:text-blue-800 mx-4"
            >
              Profile
            </Link>
            <Link
              to="/advertiser-dashboard/activities"
              className="text-blue-600 hover:text-blue-800"
            >
              Activities
            </Link>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4"></div>
    </div>
  );
};

export default AdvertiserDashBoard;
