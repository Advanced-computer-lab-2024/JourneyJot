/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditActivityModal from './EditActivity';
import DeleteActivityButton from './DeleteActivity';
import StarRating from '../Helper/StarRating';
import { useNavigate } from 'react-router-dom';
import { FiBookmark } from 'react-icons/fi';
const ActivitiesCard = ({
	activities = [],
	isAdvertiser = false,
	onDelete,
	fetchActivities,
	currency,
	conversionRate = 1,
}) => {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [currentActivity, setCurrentActivity] = useState(null);
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal state
	const [selectedActivity, setSelectedActivity] = useState(null); // Store selected activity
	const [error, setError] = useState(null); // State to handle errors
	const [shareOptionsVisible, setShareOptionsVisible] = useState(false); // Toggle for share options
	const navigate = useNavigate(); // For navigation

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
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			// Make booking request to backend
			const response = await axios.post(
				'http://localhost:3000/tourists/bookActivity',
				{ activityId: selectedActivity._id },
				config
			);

			const { message, updatedWalletBalance, pointsEarned, totalPoints } =
				response.data;

			// Display a success message with wallet and points details
			alert(
				`${message}. You earned ${pointsEarned} points! Your total points are now ${totalPoints}. Wallet balance: $${updatedWalletBalance}.`
			);

			setIsConfirmModalOpen(false); // Close the modal after booking
		} catch (error) {
			setError(error.response?.data?.message || 'An error occurred.'); // Set the error message in state
			console.error('Error booking attraction:', error);
			setIsConfirmModalOpen(false);
		}
	};

	const handleCopyLink = (activity) => {
		const link = `http://localhost:5173/activities/${activity._id}`;
		navigator.clipboard.writeText(link);
		alert('Link copied to clipboard!');
	};

	const handleShareViaEmail = (activity) => {
		const subject = encodeURIComponent(`Check out this activity`);
		const body = encodeURIComponent(
			`Here is a link to the activity: http://localhost:5173/activities/${activity._id}`
		);
		window.location.href = `mailto:?subject=${subject}&body=${body}`;
	};

	const toggleShareOptions = () => {
		setShareOptionsVisible(!shareOptionsVisible);
	};

	const handlePayActivityViaStripe = (activity) => {
		// Ensure no PointerEvent is passed to navigate
		navigate('/pay-activity-stripe', {
			state: {
				activity: activity, // Pass only the serializable activity data
				currency: currency,
				conversionRate: conversionRate,
			},
		});
	};

	const handleBookmark = async (activityId) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const response = await axios.post(
				'http://localhost:3000/tourists/bookMarkActivity',
				{ activityId },
				config
			);

			alert(response.data.message || 'Activity bookmarked successfully!');
		} catch (error) {
			console.error('Error bookmarking activity:', error);
			alert(
				error.response?.data?.message ||
					'Failed to bookmark activity. Try again later.'
			);
		}
	};

	return (
		<div className='min-h-screen flex justify-center items-center bg-gray-100 p-4'>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{activities.length > 0 ? (
					activities.map((activity) => (
						<div
							key={activity._id}
							className='bg-white rounded-lg shadow-md p-6'>
							<h2 className='text-2xl font-semibold text-blue-900 mb-4'>
								{activity.name || 'Activity Name'}
							</h2>
							<p className='text-gray-600 mb-2'>
								<strong>Advertiser:</strong>{' '}
								{activity.advertiserId?.username || 'N/A'}
							</p>
							<p className='text-gray-600 mb-2'>
								<strong>Date:</strong>{' '}
								{new Date(activity.date).toLocaleDateString()}
							</p>
							<p className='text-gray-600 mb-2'>
								<strong>Time:</strong> {activity.time || 'N/A'}
							</p>
							<p className='text-gray-600 mb-2'>
								<strong>Price:</strong>{' '}
								{activity.price
									? (activity.price * conversionRate).toFixed(1)
									: 'N/A'}{' '}
								{currency}
							</p>
							<p className='text-gray-600 mb-2'>
								<strong>Category:</strong> {activity.category?.name || 'N/A'}
							</p>
							<p className='text-gray-600 mb-2'>
								<strong>Tag:</strong> {activity.preferenceTag?.name || 'N/A'}
							</p>
							<p className='text-gray-600 mb-2'>
								<strong>Discounts:</strong> {activity.specialDiscounts || 'N/A'}
							</p>
							<p className='text-gray-600 mb-4'>
								<strong>Status:</strong>{' '}
								{activity.bookingOpen ? 'Open' : 'Closed'}
							</p>

							{/* Conditionally render buttons based on isAdvertiser */}
							{!isAdvertiser && (
								<div className='mb-4'>
									{/* Rectangular Book Now Button */}
									<button
										onClick={() => handleBookActivity(activity)}
										className='bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 mb-2'>
										Book Now
									</button>

									{/* Rectangular Pay via Stripe Button */}
									<button
										onClick={() =>
											handlePayActivityViaStripe(
												activity,
												currency,
												conversionRate
											)
										}
										className='bg-teal-600 text-white w-full py-3 rounded-lg hover:bg-teal-500 mb-2'>
										Pay via Stripe
									</button>

									{/* Share and Bookmark Buttons */}
									<div className='flex justify-between'>
										<button
											onClick={toggleShareOptions}
											className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700'>
											Share
										</button>
										<button
											onClick={() => handleBookmark(activity._id)}
											className='text-blue-500 hover:text-blue-700'>
											<FiBookmark size={24} />
										</button>
									</div>
								</div>
							)}

							{shareOptionsVisible && (
								<div className='absolute bg-white border rounded-lg shadow-md mt-4 p-4 w-full'>
									<button
										onClick={() => handleCopyLink(activity)}
										className='text-blue-600 hover:underline block mb-2'>
										Copy Link
									</button>
									<button
										onClick={() => handleShareViaEmail(activity)}
										className='text-blue-600 hover:underline block'>
										Share via Email
									</button>
								</div>
							)}

							{isAdvertiser && (
								<div className='flex space-x-4 mt-4'>
									<button
										onClick={() => handleEdit(activity)}
										className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>
										Edit
									</button>
									<DeleteActivityButton
										activityId={activity._id}
										onDelete={onDelete}
									/>
								</div>
							)}
						</div>
					))
				) : (
					<p className='text-center text-gray-500'>No activities available.</p>
				)}
			</div>

			{/* Edit Modal */}
			{isEditModalOpen && (
				<EditActivityModal
					isOpen={isEditModalOpen}
					activity={currentActivity}
					onClose={() => setIsEditModalOpen(false)}
					onUpdate={handleUpdateActivity}
				/>
			)}

			{/* Confirmation Modal for Booking */}
			{isConfirmModalOpen && (
				<div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center'>
					<div className='bg-white p-8 rounded-lg shadow-lg'>
						<h2 className='text-2xl font-semibold mb-4'>Confirm Booking</h2>
						<p className='text-lg'>
							Do you want to book this activity?{' '}
							<strong>{selectedActivity?.name}</strong>
						</p>
						<div className='flex justify-between mt-6'>
							<button
								onClick={confirmBooking}
								className='bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700'>
								Yes, Book it!
							</button>
							<button
								onClick={() => setIsConfirmModalOpen(false)}
								className='bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700'>
								Cancel
							</button>
						</div>
						{error && <div className='mt-4 text-red-500'>{error}</div>}
					</div>
				</div>
			)}
		</div>
	);
};

export default ActivitiesCard;
