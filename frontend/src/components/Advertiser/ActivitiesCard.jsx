/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditActivityModal from './EditActivity';
import DeleteActivityButton from './DeleteActivity';

// StarRating Component to display stars
const StarRating = ({ rating }) => {
	const fullStars = Math.floor(rating);
	const emptyStars = 5 - fullStars;

	return (
		<div className='flex space-x-1'>
			{[...Array(fullStars)].map((_, index) => (
				<svg
					key={`full-${index}`}
					xmlns='http://www.w3.org/2000/svg'
					className='w-5 h-5 text-yellow-500'
					fill='currentColor'
					viewBox='0 0 20 20'>
					<path d='M10 15.27l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L10 3 7.19 8.82 2 9.24l3.46 3.67-1.64 5.09L10 15.27z' />
				</svg>
			))}
			{[...Array(emptyStars)].map((_, index) => (
				<svg
					key={`empty-${index}`}
					xmlns='http://www.w3.org/2000/svg'
					className='w-5 h-5 text-gray-300'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						fill='none'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M12 17.75l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L12 3l-2.81 5.82-5.19.42L7.46 15.42 3 18.15 12 17.75z'
					/>
				</svg>
			))}
		</div>
	);
};

const ActivitiesCard = ({
	activities = [],
	isAdvertiser = false,
	onDelete,
	fetchActivities,
	currency,
	conversionRate = 1
}) => {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [currentActivity, setCurrentActivity] = useState(null);
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal state
	const [selectedActivity, setSelectedActivity] = useState(null); // Store selected activity

	useEffect(() => {
		// Fetch categories and tags
		const fetchCategories = async () => {
			try {
				const response = await axios.get('http://localhost:3000/categories');
				setCategories(response.data);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};

		const fetchTags = async () => {
			try {
				const response = await axios.get('http://localhost:3000/pref-tags');
				setTags(response.data);
			} catch (error) {
				console.error('Error fetching tags:', error);
			}
		};

		fetchCategories();
		fetchTags();
	}, []);

	const handleEdit = (activity) => {
		setCurrentActivity(activity);
		setIsEditModalOpen(true);
	};

	const handleUpdateActivity = async (updatedActivity) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const category = categories.find(
				(cat) => cat.name === updatedActivity.category
			);
			const preferenceTag = tags.find(
				(tag) => tag.name === updatedActivity.preferenceTag
			);

			if (category) updatedActivity.category = category._id;
			if (preferenceTag) updatedActivity.preferenceTag = preferenceTag._id;

			await axios.put(
				`http://localhost:3000/activities/${updatedActivity._id}`,
				updatedActivity,
				config
			);
			setIsEditModalOpen(false);
			fetchActivities();
		} catch (error) {
			console.error('Error updating activity:', error);
		}
	};

	const handleBookActivity = (activity) => {
		setSelectedActivity(activity); // Set selected activity for booking
		setIsConfirmModalOpen(true); // Open confirmation modal
	};

	const confirmBooking = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found. Please login again.");

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			// Make booking request to backend
			const response = await axios.post(
				"http://localhost:3000/tourists/bookActivity",
				{ activityId: selectedActivity._id },
				config
			);

			const {
				message,
				updatedWalletBalance,
				pointsEarned,
				totalPoints,
			} = response.data;

			// Display a success message with wallet and points details
			alert(
				`${message}. You earned ${pointsEarned} points! Your total points are now ${totalPoints}. Wallet balance: $${updatedWalletBalance}.`
			);

			setIsConfirmModalOpen(false); // Close the modal after booking
		} catch (error) {
			console.error("Error booking activity:", error);
			alert("An error occurred while booking the activity. Please try again.");
			setIsConfirmModalOpen(false);
		}
	};


	const handleShareActivity = (activity) => {
		alert(`Share link for activity: ${activity.name}`);
	};

	return (
		<div>
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
				{activities.length > 0 ? (
					activities.map((activity) => (
						<div
							key={activity._id}
							className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300"
						>
							<div className="flex flex-col h-full space-y-4 text-left">
								<ul className="list-disc list-inside space-y-2">
									<li className="text-gray-700">
										<span className="font-semibold">Advertiser Name: </span>
										{activity.advertiserId?.name || "N/A"}
									</li>
									<li className="text-gray-700">
										<span className="font-semibold">Date: </span>
										{new Date(activity.date).toLocaleDateString()}
									</li>
									<li className="text-gray-700">
										<span className="font-semibold">Time: </span>
										{activity.time}
									</li>
									<li className="text-gray-700">
										<span className="font-semibold">Price: </span>
										{(activity.price * conversionRate).toFixed(1)}   {currency}
									</li>
									<li className="text-gray-700">
										<span className="font-semibold">Category: </span>
										{activity.category?.name || "N/A"}
									</li>
									<li className="text-gray-700">
										<span className="font-semibold">Tag: </span>
										{activity.preferenceTag?.name || "N/A"}
									</li>
									<li className="text-gray-700">
										<span className="font-semibold">Special Discounts: </span>
										{activity.specialDiscounts || "N/A"}
									</li>
									<li className="text-gray-700">
										<span className="font-semibold">Booking Status: </span>
										{activity.bookingOpen ? "Open" : "Closed"}
									</li>
									<li className="text-gray-700 flex items-center">
										<span className="font-semibold mr-2">Rating: </span>
										{activity.rating ? (
											<StarRating rating={activity.rating} />
										) : (
											"N/A"
										)}
									</li>
								</ul>

								{/* Book and Share Buttons */}
								<button
									onClick={() => handleBookActivity(activity)}
									className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 mt-4'>
									Book A Ticket
								</button>
								<button
									onClick={() => handleShareActivity(activity)}
									className='bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 mt-2'>
									Share
								</button>

								{/* Edit and Delete for Advertisers */}
								{isAdvertiser && (
									<div className='flex space-x-2 mt-4'>
										<button
											onClick={() => handleEdit(activity)}
											className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
											Edit
										</button>
										<DeleteActivityButton
											activityId={activity._id}
											onDelete={onDelete}
										/>
									</div>
								)}
							</div>
						</div>
					))
				) : (
					<p className='text-center text-gray-500 col-span-full'>
						No activities available.
					</p>
				)}
			</div>

			{/* Edit Modal */}
			{isEditModalOpen && currentActivity && (
				<EditActivityModal
					activity={currentActivity}
					onClose={() => setIsEditModalOpen(false)}
					onUpdate={handleUpdateActivity}
					categories={categories}
					tags={tags}
				/>
			)}

			{/* Confirmation Modal for Booking */}
			{isConfirmModalOpen && selectedActivity && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-80'>
						<h3 className='text-lg font-semibold'>Confirm Booking</h3>
						<p>Price: ${selectedActivity.price}</p>
						<div className='flex space-x-4 mt-4'>
							<button
								onClick={confirmBooking}
								className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
								Confirm
							</button>
							<button
								onClick={() => setIsConfirmModalOpen(false)}
								className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ActivitiesCard;
