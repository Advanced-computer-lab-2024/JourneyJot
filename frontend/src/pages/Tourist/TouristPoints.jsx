import { useState } from "react";

const TouristPoints = () => {
  const [points] = useState(500);
  // Replace 500 with actual points value if available

  const handleRedeemPoints = () => {
    alert("Your points have been redeemed to cash in your wallet!");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-teal-900">
        Tourist Points
      </h1>
      <div className="p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-md text-center">
        <p className="text-lg font-semibold text-teal-700">
          Your Points: <span className="text-teal-600">{points}</span>
        </p>
      </div>
      <button
        className="mt-6 w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 rounded-md shadow-lg hover:bg-teal-700 transition duration-200"
        onClick={handleRedeemPoints}
      >
        Redeem Points for Wallet Cash
      </button>
    </div>
  );
};

export default TouristPoints;
