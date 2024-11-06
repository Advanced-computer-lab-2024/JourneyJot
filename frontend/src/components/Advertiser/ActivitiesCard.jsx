/** @format */

// ActivitiesCard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditActivityModal from './EditActivity';
import DeleteActivityButton from './DeleteActivity';

const ActivitiesCard = ({
	activities = [],
	isAdvertiser = false,
	onDelete,
	fetchActivities,
}) => {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [currentActivity, setCurrentActivity] = useState(null);
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);

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
			if (!token) {
				throw new Error('No token found. Please login again.');
			}

			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			const category = categories.find(
				(cat) => cat.name === updatedActivity.category
			);
			if (category) {
				updatedActivity.category = category._id;
			} else {
				throw new Error('Category not found');
			}

			const preferenceTag = tags.find(
				(tag) => tag.name === updatedActivity.preferenceTag
			);
			if (preferenceTag) {
				updatedActivity.preferenceTag = preferenceTag._id;
			} else {
				throw new Error('Preference Tag not found');
			}

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
										<span className='font-semibold'>Date: </span>
										{new Date(activity.date).toLocaleDateString()}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Time: </span>
										{activity.time}
									</li>
									<li className='text-gray-700'>
										<span className='font-semibold'>Price: </span>
										{activity.price || 'N/A'}
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
									<li className='text-gray-700'>
										<span className='font-semibold'>Rating: </span>
										{activity.rating || 'N/A'}
									</li>
								</ul>

								{/* Delete and Edit Buttons for Advertiser */}
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
		</div>
	);
};

export default ActivitiesCard;
