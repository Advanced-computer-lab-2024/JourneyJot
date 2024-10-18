/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const TourGuideProfile = () => {
	const [profileData, setProfileData] = useState({
		mobileNumber: '',
		yearsOfExperience: '',
		previousWork: '',
	});
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
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

				const response = await axios.get(
					'http://localhost:3000/tour-guides/profile',
					config
				);

				setProfileData({
					mobileNumber: response.data.tourGuideProfile.mobileNumber || '',
					yearsOfExperience:
						response.data.tourGuideProfile.yearsOfExperience || '',
					previousWork: response.data.tourGuideProfile.previousWork || '',
				});
			} catch (error) {
				setError('Failed to fetch profile');
				console.error('Failed to fetch profile:', error);
			}
		};

		fetchProfile();
	}, []);

	const handleChange = (e) => {
		setProfileData({ ...profileData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('token');
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			const response = await axios.put(
				'http://localhost:3000/tour-guides/profile',
				profileData,
				config
			);
			setProfileData(response.data);
			setIsEditing(false);
			console.log('Profile updated successfully', response.data);
		} catch (error) {
			setError('Failed to update profile');
			console.error('Failed to update profile:', error);
		}
	};

	return (
		<div className='max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg'>
			<h1 className='text-2xl font-bold text-center mb-6'>
				Tour Guide Profile
			</h1>
			{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
			{!isEditing ? (
				<div className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>Profile Details</h2>
					<div className='bg-white p-4 rounded-lg shadow'>
						<p className='mb-2'>
							<strong>Mobile Number:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.mobileNumber || 'N/A'}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Years of Experience:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.yearsOfExperience || 'N/A'}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Previous Work:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.previousWork || 'N/A'}
							</span>
						</p>
					</div>
					<button
						className='mt-4 w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition duration-200'
						onClick={() => setIsEditing(true)}>
						Edit Profile
					</button>
				</div>
			) : (
				<form
					className='bg-white p-6 rounded-lg shadow'
					onSubmit={handleSubmit}>
					<h2 className='text-xl font-semibold mb-4'>Edit Profile</h2>
					<div className='space-y-4'>
						<label className='block'>
							<span className='font-medium'>Mobile Number:</span>
							<input
								type='text'
								name='mobileNumber'
								value={profileData.mobileNumber}
								onChange={handleChange}
								required
								className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200'
							/>
						</label>
						<label className='block'>
							<span className='font-medium'>Years of Experience:</span>
							<input
								type='text'
								name='yearsOfExperience'
								value={profileData.yearsOfExperience}
								onChange={handleChange}
								required
								className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200'
							/>
						</label>
						<label className='block'>
							<span className='font-medium'>Previous Work:</span>
							<input
								type='text'
								name='previousWork'
								value={profileData.previousWork}
								onChange={handleChange}
								required
								className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200'
							/>
						</label>
					</div>
					<div className='flex justify-between mt-6'>
						<button
							className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200'
							type='submit'>
							Update Profile
						</button>
						<button
							className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200'
							type='button'
							onClick={() => setIsEditing(false)}>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default TourGuideProfile;
