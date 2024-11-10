/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing icons for dropdown

const TourGuideDetails = () => {
	const { id } = useParams();
	const [tourGuideProfile, setTourGuideProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showReviews, setShowReviews] = useState(false); // State to toggle reviews dropdown

	useEffect(() => {
		const fetchTourGuideProfile = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/tour-guides/profile/${id}`
				);
				setTourGuideProfile(response.data.tourGuideProfile);
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};

		fetchTourGuideProfile();
	}, [id]);

	if (loading) {
		return <div className='text-center text-lg font-semibold'>Loading...</div>;
	}

	if (error) {
		return (
			<div className='text-center text-lg font-semibold text-red-500'>
				Error: {error}
			</div>
		);
	}

	const renderStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			if (i <= rating) {
				stars.push(
					<FaStar
						key={i}
						className='text-yellow-500'
					/>
				);
			} else {
				stars.push(
					<FaRegStar
						key={i}
						className='text-yellow-300'
					/>
				);
			}
		}
		return stars;
	};

	const toggleReviews = () => {
		setShowReviews((prevShowReviews) => !prevShowReviews);
	};

	return (
		<div className='max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg space-y-6'>
			<h1 className='text-3xl font-semibold text-center text-gray-800'>
				Tour Guide Profile
			</h1>

			{/* Tour Guide Information */}
			<div className='flex justify-center'>
				{tourGuideProfile.image ? (
					<img
						src={tourGuideProfile.image}
						alt='Tour Guide'
						className='w-32 h-32 rounded-full object-cover shadow-lg'
					/>
				) : (
					<div className='w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-bold'>
						TG
					</div>
				)}
			</div>

			<div className='text-center'>
				<h2 className='text-2xl font-bold text-gray-800'>
					{tourGuideProfile.name}
				</h2>
				<p className='text-gray-600'>{tourGuideProfile.mobileNumber}</p>
				<p className='text-gray-600'>
					{tourGuideProfile.yearsOfExperience} years of experience
				</p>
				<p className='text-gray-600'>
					{tourGuideProfile.previousWork || 'No previous work provided'}
				</p>
			</div>

			{/* Ratings Dropdown Section */}
			<div>
				<div
					className='flex items-center justify-between cursor-pointer'
					onClick={toggleReviews}>
					<h3 className='text-xl font-semibold text-gray-800'>Ratings</h3>
					<span className='text-lg font-semibold text-gray-600'>
						{tourGuideProfile.ratings.length} Reviews{' '}
						{showReviews ? <FaChevronUp /> : <FaChevronDown />}
					</span>
				</div>

				{showReviews && (
					<div className='mt-4'>
						{tourGuideProfile.ratings.length === 0 ? (
							<p>No ratings yet</p>
						) : (
							tourGuideProfile.ratings.map((rating, index) => (
								<div
									key={index}
									className='border-b border-gray-300 pb-4 mb-4'>
									<div className='flex justify-between items-center'>
										<span className='font-bold text-gray-800'>User:</span>
										<span>
											{rating.userId ? rating.userId.username : 'Anonymous'}
										</span>
									</div>
									<div className='flex justify-between items-center'>
										<span className='font-bold text-gray-800'>Rating:</span>
										<div className='flex'>
											{renderStars(rating.rating || 0)}
										</div>
									</div>
									<div className='flex justify-between items-center'>
										<span className='font-bold text-gray-800'>Comment:</span>
										<span>{rating.comment || 'No comment'}</span>
									</div>
								</div>
							))
						)}
					</div>
				)}
			</div>

			{/* File Link (if exists) */}
			{tourGuideProfile.file && (
				<div>
					<h3 className='text-xl font-semibold text-gray-800'>
						Additional File
					</h3>
					<a
						href={tourGuideProfile.file}
						target='_blank'
						rel='noopener noreferrer'
						className='text-blue-500'>
						Download the file
					</a>
				</div>
			)}
		</div>
	);
};

export default TourGuideDetails;
