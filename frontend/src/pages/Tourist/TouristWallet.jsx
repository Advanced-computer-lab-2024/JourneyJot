import { useState } from "react";

const TouristWallet = () => {
  const [walletBalance] = useState("");
  const handleAddFunds = () => {
    alert("Redirecting to add funds page...");
  };

  const handleViewHistory = () => {
    alert("Opening transaction history...");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-teal-900">
        Wallet
      </h1>
      <div className="p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-md text-center">
        <p className="text-lg font-semibold text-teal-700">
          Wallet Balance:{" "}
          <span className="text-teal-600">${walletBalance}</span>
        </p>
      </div>
      <div className="mt-6 space-y-3">
        <button
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 rounded-md shadow-lg hover:bg-teal-700 transition duration-200"
          onClick={handleAddFunds}
        >
          Add Funds
        </button>
        <button
          className="w-full bg-gradient-to-r from-teal-400 to-teal-500 text-white py-2 rounded-md shadow-lg hover:bg-teal-600 transition duration-200"
          onClick={handleViewHistory}
        >
          View Transaction History
        </button>
      </div>
    </div>
  );
};

export default TouristWallet;
