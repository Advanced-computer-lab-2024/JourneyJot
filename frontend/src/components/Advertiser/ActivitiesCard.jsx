/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditActivityModal from './EditActivity';
import DeleteActivityButton from './DeleteActivity';
import StarRating from '../Helper/StarRating';
import { useNavigate } from 'react-router-dom';

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

	return (
		<div>
			<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
				{activities.length > 0 ? (
					activities.map((activity) => (
						<div
							key={activity._id}
							className='border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300'>
							<div className='flex flex-col h-full space-y-4 text-left'>
								<ul className='list-disc list-inside space-y-2'>
									<li className='text-gray-700'>
										<span className='font-semibold'>Advertiser Name: </span>
										{activity.advertiserId?.username || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Date: </span>
										{new Date(activity.date).toLocaleDateString()}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Time: </span>
										{activity.time}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Price: </span>
										{(activity.price * conversionRate).toFixed(1)} {currency}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Category: </span>
										{activity.category?.name || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Tag: </span>
										{activity.preferenceTag?.name || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Special Discounts: </span>
										{activity.specialDiscounts || 'N/A'}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Booking Status: </span>
										{activity.bookingOpen ? 'Open' : 'Closed'}
									</li>
									<li className='text-gray-700 flex items-center'>
										<span className='font-semibold mr-2'>Rating: </span>
										{activity.rating ? (
											<StarRating rating={activity.rating} />
										) : (
											'N/A'
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
									onClick={() => navigate('/pay-stripe')}
									className='px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition duration-300 shadow-md'>
									Pay via Stripe
								</button>
								<div className='relative'>
									<button
										onClick={toggleShareOptions}
										className='bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 mt-2'>
										Share
									</button>
									{shareOptionsVisible && (
										<div className='absolute bg-white border rounded shadow-md p-2 mt-1'>
											<button
												onClick={() => handleCopyLink(activity)}
												className='text-blue-600 hover:underline block'>
												Copy Link
											</button>
											<button
												onClick={() => handleShareViaEmail(activity)}
												className='text-blue-600 hover:underline block'>
												Share via Email
											</button>
										</div>
									)}
								</div>

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
					<p className='text-center text-gray-500'>No activities found.</p>
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

			{/* Confirmation Modal for booking */}
			{isConfirmModalOpen && (
				<div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center'>
					<div className='bg-white p-6 rounded-lg'>
						<h2 className='text-xl mb-4'>Confirm Booking</h2>
						<p>
							Do you want to book this activity?{' '}
							<strong>{selectedActivity?.name}</strong>
						</p>
						<div className='flex justify-between mt-4'>
							<button
								onClick={confirmBooking}
								className='bg-green-600 text-white px-4 py-2 rounded'>
								Yes, Book it!
							</button>
							<button
								onClick={() => setIsConfirmModalOpen(false)}
								className='bg-red-600 text-white px-4 py-2 rounded'>
								Cancel
							</button>
						</div>
						{error && (
							<div className='mt-4 text-red-500'>
								<p>{error}</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default ActivitiesCard;
