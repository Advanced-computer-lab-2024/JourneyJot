import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ButtonCategories = () => {
  const categories = [
    {
      label: "Shop",
      buttons: [
        { label: "Points", path: "/tourist/homePage/points" },
        { label: "Wallet", path: "/tourist/homePage/wallet" },
        { label: "Products", path: "/tourist/homePage/products" },
      ],
    },
    {
      label: "Bookings",
      buttons: [
        {
          label: "Book Transportation",
          path: "/tourist/homePage/transportation",
        },
        { label: "Book Hotel", path: "/tourist/homepage/hotels" },
        { label: "Book Flight", path: "/tourist/homepage/flights" },
        { label: "Reservations", path: "/tourist/homePage/reservations" },
      ],
    },
    {
      label: "Account",
      buttons: [
        { label: "My Profile", path: "/tourist/homePage/profile" },
        { label: "Change Password", path: "/tourist/homePage/change-password" },
        { label: "Forget Password?", path: "/forgot-password" },
        { label: "My Address", path: "/tourist-address" },
      ],
    },
    {
      label: "Other",
      buttons: [
        { label: "Complaints", path: "/tourist/homePage/complaints" },
        { label: "Promo Codes", path: "/tourist/homePage/promo-codes" },
        { label: "Completed Activities", path: "/completed" },
        { label: "BookMark Events", path: "/tourist/homepage/bookmarks" },
      ],
    },
  ];

  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate(); // Use navigate for routing

  const toggleDropdown = (index) => {
    setExpanded((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4">
        {categories.map((category, index) => (
          <div key={category.label} className="relative">
            {/* Category Button */}
            <button
              onClick={() => toggleDropdown(index)}
              className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-200 focus:outline-none"
            >
              {category.label}
            </button>

            {/* Dropdown Buttons */}
            {expanded === index && (
              <div className="absolute mt-2 left-0 z-10 bg-white border border-gray-300 rounded-lg shadow-md">
                {category.buttons.map((button) => (
                  <button
                    key={button.label}
                    onClick={() => navigate(button.path)}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200 text-left"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonCategories;
