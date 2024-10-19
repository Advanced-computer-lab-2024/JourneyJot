/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const TourGuideProfile = () => {
	const [profileData, setProfileData] = useState({
		mobileNumber: '',
		yearsOfExperience: '',
		previousWork: '',
	});
	const [initialProfileData, setInitialProfileData] = useState({
		mobileNumber: '',
		yearsOfExperience: '',
		previousWork: '',
	});
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [image, setImage] = useState('');
	const [imageUploadError, setImageUploadError] = useState(null);

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

			const { mobileNumber, yearsOfExperience, previousWork } =
				response.data.tourGuideProfile || {};

			// Check if all fields are empty
			if (!mobileNumber && !yearsOfExperience && !previousWork) {
				setError('Profile information is missing. Please update your profile.');
			} else {
				setProfileData({
					mobileNumber: mobileNumber || '',
					yearsOfExperience: yearsOfExperience || '',
					previousWork: previousWork || '',
				});
				// Keep the initial profile data for cancel action
				setInitialProfileData({
					mobileNumber: mobileNumber || '',
					yearsOfExperience: yearsOfExperience || '',
					previousWork: previousWork || '',
				});
				setError(null); // Clear any previous errors
			}
		} catch (error) {
			setError('Failed to fetch profile');
			console.error('Failed to fetch profile:', error);
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	const handleChange = (e) => {
		setProfileData({ ...profileData, [e.target.name]: e.target.value });
	};

	function handleImage(e) {
		setImage(e.target.files[0]);
	}

	const submitImage = async (e) => {
		e.preventDefault();
		try {
			if (!image) {
				throw new Error('Please select an image.');
			}

			const formData = new FormData();
			formData.append('image', image);

			const result = await axios.post(
				'http://localhost:3000/upload',
				formData,
				{ headers: { 'Content-Type': 'multipart/form-data' } }
			);

			console.log('Image uploaded successfully:', result.data);
			setImageUploadError(null); // Clear any upload errors
		} catch (error) {
			setImageUploadError('Failed to upload image');
			console.error('Failed to upload image:', error);
		}
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

			// Update the initial profile data to reflect changes
			const updatedProfile = response.data.tourGuideProfile || {};
			setProfileData({
				mobileNumber: updatedProfile.mobileNumber || '',
				yearsOfExperience: updatedProfile.yearsOfExperience || '',
				previousWork: updatedProfile.previousWork || '',
			});
			setInitialProfileData({
				mobileNumber: updatedProfile.mobileNumber || '',
				yearsOfExperience: updatedProfile.yearsOfExperience || '',
				previousWork: updatedProfile.previousWork || '',
			});

			// Re-render the UI after profile update
			setIsEditing(false);
			setError(null); // Clear any error message
			console.log('Profile updated successfully', response.data);
		} catch (error) {
			setError('Failed to update profile');
			console.error('Failed to update profile:', error);
		}
	};

	const handleCancel = () => {
		// Reset to the initial values when cancel is clicked
		setProfileData(initialProfileData);
		setIsEditing(false);
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
					<form
						className='bg-white p-4 rounded-lg shadow'
						onSubmit={submitImage}>
						<input
							type='file'
							accept='image/*'
							onChange={handleImage}
						/>
						{imageUploadError && (
							<p className='text-red-500 text-center'>{imageUploadError}</p>
						)}
						<button
							className='mt-4 bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700 transition duration-200'
							type='submit'>
							Upload Image
						</button>
					</form>
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
							onClick={handleCancel}>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default TourGuideProfile;
