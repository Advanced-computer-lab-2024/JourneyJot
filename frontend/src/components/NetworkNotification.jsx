import React, { useState, useEffect } from "react";

const NetworkNotification = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineMessage(true);

      // Hide the online message after 3 seconds
      setTimeout(() => setShowOnlineMessage(false), 3000);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Notification */}
      {!isOnline && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white text-lg font-semibold py-4 px-6 z-50 shadow-lg transition-transform transform translate-y-0">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">You are offline!</span>
            <button
              className="bg-white text-red-600 rounded-full p-2 shadow-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
          <p className="mt-2">
            Check your connection to continue using the site.
          </p>
        </div>
      )}

      {/* Online Notification */}
      {showOnlineMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white text-lg font-semibold py-3 px-5 rounded-lg shadow-lg z-50 transition-opacity duration-300 opacity-100">
          <div className="flex items-center space-x-2">
            <i className="fas fa-check-circle text-2xl"></i>
            <span>You are back online!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default NetworkNotification;
