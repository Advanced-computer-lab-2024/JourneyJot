/** @format */

import { useState } from 'react';

const TouristPoints = () => {
    const [points] = useState(500);
    // Replace 500 with actual points value if available

    const handleRedeemPoints = () => {
        alert('Your points have been redeemed to cash in your wallet!');
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Tourist Points</h1>
            <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-lg font-semibold">
                    Your Points: <span className="text-green-600">{points}</span>
                </p>
            </div>
            <button
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700 transition duration-200"
                onClick={handleRedeemPoints}
            >
                Redeem Points for Wallet Cash
            </button>
        </div>
    );
};

export default TouristPoints;
