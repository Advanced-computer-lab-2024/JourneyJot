/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditActivityModal from './EditActivity';
import DeleteActivityButton from './DeleteActivity';
import StarRating from '../Helper/StarRating';
import { useNavigate } from 'react-router-dom';
import { FiBookmark, FiShare2, FiEdit, FiTrash2 } from 'react-icons/fi';
import { MdPayment } from 'react-icons/md';
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState(null);
	// Removed shareOptionsVisible state
	const [loading, setLoading] = useState({
		book: false,
		cancel: false,
	});
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch categories and tags
		const fetchCategories = async () => {
			try {
				const response = await axios.get('http://localhost:3000/categories');
				setCategories(response.data);
			} catch (error) {
				toast.error('Error fetching categories.');
				console.error('Error fetching categories:', error);
			}
		};

		const fetchTags = async () => {
			try {
				const response = await axios.get('http://localhost:3000/pref-tags');
				setTags(response.data);
			} catch (error) {
				toast.error('Error fetching tags.');
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
			if (!token) {
				toast.error('No token found. Please login again.');
				throw new Error('No token found. Please login again.');
			}

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
			toast.success('Activity updated successfully!');
			setIsEditModalOpen(false);
			fetchActivities();
		} catch (error) {
			const errorMsg =
				error.response?.data?.message || 'Error updating activity.';
			toast.error(errorMsg);
			console.error('Error updating activity:', error);
		}
	};

	const handleBookActivity = (activity) => {
		if (!activity.bookingOpen) {
			toast.info('This activity is not available for booking.');
			return;
		}
		setSelectedActivity(activity);
		setIsConfirmModalOpen(true);
	};

	const confirmBooking = async () => {
		if (!selectedActivity) {
			toast.error('No activity selected for booking.');
			return;
		}

		setLoading((prev) => ({ ...prev, book: true }));
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				toast.error('No token found. Please login again.');
				throw new Error('No token found. Please login again.');
			}

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			// Verify if the backend expects 'activityId' or 'attractionId' and 'ticketType'
			// Adjust the payload accordingly
			// Assuming backend expects 'activityId'
			const payload = {
				activityId: selectedActivity._id,
			};

			const response = await axios.post(
				'http://localhost:3000/tourists/bookActivity',
				payload,
				config
			);

			const { message, updatedWalletBalance, pointsEarned, totalPoints } =
				response.data;

			// Display a success toast with wallet and points details
			toast.success(
				`${message}. You earned ${pointsEarned} points! Your total points are now ${totalPoints}. Wallet balance: $${updatedWalletBalance}.`
			);

			setIsConfirmModalOpen(false);
		} catch (error) {
			const errorMsg =
				error.response?.data?.message || 'An error occurred while booking.';
			toast.error(errorMsg);
			console.error('Error booking activity:', error);
			setIsConfirmModalOpen(false);
		} finally {
			setLoading((prev) => ({ ...prev, book: false }));
		}
	};

	const handleCopyLink = (activity) => {
		const link = `http://localhost:5173/activities/${activity._id}`;
		navigator.clipboard.writeText(link);
		toast.info('Link copied to clipboard!');
	};

	const handleShareViaEmail = (activity) => {
		const subject = encodeURIComponent(`Check out this activity`);
		const body = encodeURIComponent(
			`Here is a link to the activity: http://localhost:5173/activities/${activity._id}`
		);
		window.location.href = `mailto:?subject=${subject}&body=${body}`;
	};

	// Removed toggleShareOptions function

	const handlePayActivityViaStripe = (activity) => {
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
			if (!token) {
				toast.error('No token found. Please login again.');
				throw new Error('No token found. Please login again.');
			}

			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const response = await axios.post(
				'http://localhost:3000/tourists/bookMarkActivity',
				{ activityId },
				config
			);

			toast.success(
				response.data.message || 'Activity bookmarked successfully!'
			);
		} catch (error) {
			const errorMsg =
				error.response?.data?.message ||
				'Failed to bookmark activity. Try again later.';
			toast.error(errorMsg);
			console.error('Error bookmarking activity:', error);
		}
	};

	return (
		<div className='flex flex-wrap justify-center gap-4'>
			{/* Toast Container for Notifications */}
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
			/>
			<button
				onClick={() => navigate(-1)}
				className='text-gray-700 text-xl mb-4 flex items-center hover:text-gray-900 transition absolute top-0 left-0 mt-4 ml-4'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-6 w-6 mr-2'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
					strokeWidth={2}>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M15 19l-7-7 7-7'
					/>
				</svg>
				Back
			</button>

			{activities.length > 0 ? (
				activities.map((activity) => (
					<div
						key={activity._id}
						className='relative bg-white rounded-lg shadow-md overflow-hidden w-72 hover:shadow-xl transition-shadow duration-300'>
						{/* Activity Details */}
						<div className='p-4 space-y-2'>
							<h2 className='text-xl font-semibold text-blue-900 truncate'>
								{activity.name || 'Activity Name'}
							</h2>
							<div className='flex items-center text-gray-600 text-sm'>
								<span className='font-medium'>Advertiser:</span>
								<span className='ml-1'>
									{activity.advertiserId?.username || 'N/A'}
								</span>
							</div>
							<div className='flex items-center text-gray-600 text-sm'>
								<span className='font-medium'>Date:</span>
								<span className='ml-1'>
									{new Date(activity.date).toLocaleDateString()}
								</span>
							</div>
							<div className='flex items-center text-gray-600 text-sm'>
								<span className='font-medium'>Time:</span>
								<span className='ml-1'>{activity.time || 'N/A'}</span>
							</div>
							<div className='flex items-center text-gray-600 text-sm'>
								<span className='font-medium'>Price:</span>
								<span className='ml-1'>
									{activity.price
										? (activity.price * conversionRate).toFixed(2)
										: 'N/A'}{' '}
									{currency}
								</span>
							</div>
							<div className='flex items-center text-gray-600 text-sm'>
								<span className='font-medium'>Category:</span>
								<span className='ml-1'>{activity.category?.name || 'N/A'}</span>
							</div>
							<div className='flex items-center text-gray-600 text-sm'>
								<span className='font-medium'>Tag:</span>
								<span className='ml-1'>
									{activity.preferenceTag?.name || 'N/A'}
								</span>
							</div>
							<div className='flex items-center text-gray-600 text-sm'>
								<span className='font-medium'>Discounts:</span>
								<span className='ml-1'>
									{activity.specialDiscounts || 'N/A'}
								</span>
							</div>
							<div className='flex items-center text-gray-600 text-sm'>
								<span className='font-medium'>Status:</span>
								<span className='ml-1'>
									{activity.bookingOpen ? (
										<span className='text-green-500'>Open</span>
									) : (
										<span className='text-red-500'>Closed</span>
									)}
								</span>
							</div>
							{/* Star Rating */}
							<div className='flex items-center'>
								<StarRating rating={activity.rating || 0} />
								<span className='ml-2 text-gray-600 text-sm'>
									({activity.num_reviews || 0})
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						{!isAdvertiser && (
							<div className='p-4 border-t border-gray-200 flex flex-col space-y-2'>
								{/* Book Now Button */}
								<button
									onClick={() => handleBookActivity(activity)}
									className={`flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
										loading.book ? 'opacity-50 cursor-not-allowed' : ''
									}`}
									disabled={loading.book}>
									{loading.book ? 'Booking...' : 'Book Now'}
								</button>

								{/* Pay via Stripe Button */}
								<button
									onClick={() => handlePayActivityViaStripe(activity)}
									className='flex items-center justify-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors duration-200'>
									<MdPayment className='mr-2' /> Pay via Stripe
								</button>

								{/* Share and Bookmark Icons */}
								<div className='flex justify-between items-center'>
									{/* Share Options are now always visible */}
									<div className='relative'>
										{/* Removed the toggle share button */}
										{/* Share options are always rendered */}
										<div className='mt-2 w-40 bg-blue-50 border border-gray-200 rounded-lg shadow-lg p-2 z-50'>
											<button
												onClick={() => handleCopyLink(activity)}
												className='flex items-center w-full text-left px-2 py-1 hover:bg-blue-100 rounded text-blue-600'>
												Copy Link
											</button>
											<button
												onClick={() => handleShareViaEmail(activity)}
												className='flex items-center w-full text-left px-2 py-1 hover:bg-blue-100 rounded text-blue-600'>
												Share via Email
											</button>
											{/* Social Media Share Icons */}
											<div className='flex justify-around mt-2'>
												<a
													href={`https://facebook.com/sharer/sharer.php?u=http://localhost:5173/activities/${activity._id}`}
													target='_blank'
													rel='noopener noreferrer'
													className='text-blue-600 hover:text-blue-800'
													aria-label='Share on Facebook'>
													<FaFacebookF size={18} />
												</a>
												<a
													href={`https://twitter.com/intent/tweet?url=http://localhost:5173/activities/${activity._id}`}
													target='_blank'
													rel='noopener noreferrer'
													className='text-blue-400 hover:text-blue-600'
													aria-label='Share on Twitter'>
													<FaTwitter size={18} />
												</a>
												<a
													href={`https://instagram.com/?url=http://localhost:5173/activities/${activity._id}`}
													target='_blank'
													rel='noopener noreferrer'
													className='text-pink-500 hover:text-pink-700'
													aria-label='Share on Instagram'>
													<FaInstagram size={18} />
												</a>
												<a
													href={`https://linkedin.com/shareArticle?mini=true&url=http://localhost:5173/activities/${activity._id}`}
													target='_blank'
													rel='noopener noreferrer'
													className='text-blue-700 hover:text-blue-900'
													aria-label='Share on LinkedIn'>
													<FaLinkedinIn size={18} />
												</a>
											</div>
										</div>
									</div>

									{/* Bookmark Icon */}
									<button
										onClick={() => handleBookmark(activity._id)}
										className='text-blue-500 hover:text-blue-700 transition-colors duration-200'
										aria-label='Bookmark Activity'>
										<FiBookmark size={20} />
									</button>
								</div>
							</div>
						)}

						{/* Advertiser Action Buttons */}
						{isAdvertiser && (
							<div className='p-4 border-t border-gray-200 flex justify-end space-x-2'>
								<button
									onClick={() => handleEdit(activity)}
									className='flex items-center bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors duration-200'
									aria-label='Edit Activity'>
									<FiEdit
										size={18}
										className='mr-1'
									/>{' '}
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
			{isConfirmModalOpen && selectedActivity && (
				<div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-80'>
						<h2 className='text-xl font-semibold mb-4'>Confirm Booking</h2>
						<p className='mb-6'>
							Do you want to book the activity{' '}
							<strong>{selectedActivity?.name}</strong>?
						</p>
						<div className='flex justify-end space-x-4'>
							<button
								onClick={confirmBooking}
								className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 ${
									loading.book ? 'opacity-50 cursor-not-allowed' : ''
								}`}>
								{loading.book ? 'Booking...' : 'Yes, Book it!'}
							</button>
							<button
								onClick={() => setIsConfirmModalOpen(false)}
								className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200'>
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
