/** @format */

import { useState } from 'react';

const TouristWallet = () => {
    const [walletBalance] = useState("");
    const handleAddFunds = () => {
        alert('Redirecting to add funds page...');
    };

    const handleViewHistory = () => {
        alert('Opening transaction history...');
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Wallet</h1>
            <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-lg font-semibold">
                    Wallet Balance: <span className="text-blue-600">${walletBalance}</span>
                </p>
            </div>
            <div className="mt-4 space-y-3">
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
                    onClick={handleAddFunds}
                >
                    Add Funds
                </button>
                <button
                    className="w-full bg-gray-600 text-white py-2 rounded-md shadow hover:bg-gray-700 transition duration-200"
                    onClick={handleViewHistory}
                >
                    View Transaction History
                </button>
            </div>
        </div>
    );
};

export default TouristWallet;
