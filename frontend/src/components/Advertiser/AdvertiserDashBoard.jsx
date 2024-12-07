/** @format */
import React from "react";
import { Link } from "react-router-dom";

const AdvertiserDashBoard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Advertiser Dashboard
          </h1>
          <div className="space-x-6">
            <Link
              to="/advertiser-dashboard/profile"
              className="text-blue-600 hover:text-blue-800"
            >
              Profile
            </Link>
            <Link
              to="/advertiser-dashboard/transportation"
              className="text-blue-600 hover:text-blue-800"
            >
              Transportation
            </Link>
            <Link
              to="/advertiser-dashboard/activities"
              className="text-blue-600 hover:text-blue-800"
            >
              Activities
            </Link>
            <Link
              to="/advertiser-dashboard/change-password"
              className="text-blue-600 hover:text-blue-800"
            >
              Change Password
            </Link>
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-800"
            >
              Forgot Password?
            </Link>
            <Link
              to="/activity-revenue"
              className="text-blue-600 hover:text-blue-800"
            >
              Activity Revenue
            </Link>
            <Link
              to="/count-tourists-activities"
              className="text-blue-600 hover:text-blue-800"
            >
              Tourists Count
            </Link>
            <Link
              to="/display-notification-activity"
              className="text-blue-600 hover:text-blue-800"
            >
              Notifications
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-6 px-6">
        {/* Welcome Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome, Advertiser!
          </h2>
          <p className="text-lg text-gray-600">
            Manage your activities, track revenue, and access key features all
            in one place.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                to="/advertiser-dashboard/profile"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/advertiser-dashboard/transportation"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Transportation
              </Link>
            </li>
            <li>
              <Link
                to="/advertiser-dashboard/activities"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Activities
              </Link>
            </li>
            <li>
              <Link
                to="/advertiser-dashboard/change-password"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Change Password
              </Link>
            </li>
            <li>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Forgot Password?
              </Link>
            </li>
            <li>
              <Link
                to="/activity-revenue"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Activity Revenue
              </Link>
            </li>
            <li>
              <Link
                to="/count-tourists-activities"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Tourists Count
              </Link>
            </li>
            <li>
              <Link
                to="/display-notification-activity"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Notifications
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserDashBoard;
