/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristPoints = () => {
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found. Please login again.");

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                const response = await axios.get("http://localhost:3000/tourists/points", config);
                const { points } = response.data;

                setPoints(Math.floor(points)); // Set points as a whole number
                setLevel(calculateLevel(points)); // Determine level based on points
            } catch (error) {
                console.error("Error fetching points:", error);
                alert("Failed to load points. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPoints();
    }, []);

    // Function to determine level based on points
    const calculateLevel = (points) => {
        if (points > 500000) return 3;
        if (points > 100000) return 2;
        return 1;
    };

    // Function to get badge based on level
    const getBadge = (level) => {
        switch (level) {
            case 1:
                return "Bronze Badge";
            case 2:
                return "Silver Badge";
            case 3:
                return "Gold Badge";
            default:
                return "No Badge";
        }
    };

    // Redeem points for wallet cash
    const handleRedeemPoints = async () => {
        try {
            // Check if the user has points to redeem
            if (points === 0) {
                alert("You have no points to redeem.");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to redeem points.");
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const response = await axios.post("http://localhost:3000/tourists/redeemPoints", {}, config);

            // Update points and display new wallet balance
            setPoints(Math.floor(response.data.remainingPoints)); // Display remaining points as a whole number
            alert(`Points redeemed! New wallet balance: ${response.data.newWalletBalance.toFixed(2)} USD`);
        } catch (error) {
            console.error("Error redeeming points:", error);
            alert("Failed to redeem points. Please try again.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Tourist Points</h1>
            <div className="bg-white p-4 rounded-lg shadow text-center">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <p className="text-lg font-semibold">
                            Your Points: <span className="text-green-600">{points}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Your Level: <span className="text-blue-600">Level {level}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Badge: <span className="text-yellow-600">{getBadge(level)}</span>
                        </p>
                    </>
                )}
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
