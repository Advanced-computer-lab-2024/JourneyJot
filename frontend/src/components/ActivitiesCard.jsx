import React from "react";

const ActivitiesCard = ({ activities = [] }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div
            key={activity._id}
            className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex flex-col h-full space-y-4">
              {/* Date */}
              <div className="text-gray-700">
                <span className="font-semibold">Date: </span>
                {activity.date}
              </div>

              {/* Time */}
              <div className="text-gray-700">
                <span className="font-semibold">Time: </span>
                {activity.time}
              </div>

              {/* Location */}
              <div className="text-gray-700">
                <span className="font-semibold">Location: </span>
                {activity.location.coordinates}
              </div>

              {/* Price */}
              <div className="text-gray-700">
                <span className="font-semibold">Price: </span>${activity.price}
              </div>

              {/* Price Range */}
              <div className="text-gray-700">
                <span className="font-semibold">Price Range: </span>
                {activity.priceRange}
              </div>

              {/* tags */}
              <div className="text-gray-700">
                <span className="font-semibold">Tags: </span>
                {activity.tags}
              </div>

              {/* special discounts */}
              <div className="text-gray-700">
                <span className="font-semibold">Special Discounts: </span>
                {activity.specialDiscounts}
              </div>

              {/* Booking Open */}
              <div className="text-gray-700">
                <span className="font-semibold">Booking Open: </span>
                {activity.bookingOpen}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No activities available.
        </p>
      )}
    </div>
  );
};

export default ActivitiesCard;
