/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const TourGuideProfile = () => {
	const [profileData, setProfileData] = useState({
		mobileNumber: '',
		yearsOfExperience: '',
		previousWork: '',
		image: '',
	});
	const [initialProfileData, setInitialProfileData] = useState({
		mobileNumber: '',
		yearsOfExperience: '',
		previousWork: '',
		image: '',
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

			const { mobileNumber, yearsOfExperience, previousWork, image } =
				response.data.tourGuideProfile || {};

			setProfileData({
				mobileNumber: mobileNumber || '',
				yearsOfExperience: yearsOfExperience || '',
				previousWork: previousWork || '',
				image: image ? `http://localhost:3000/images/${image}` : '',
			});
			setInitialProfileData({
				mobileNumber: mobileNumber || '',
				yearsOfExperience: yearsOfExperience || '',
				previousWork: previousWork || '',
				image: image ? `http://localhost:3000/images/${image}` : '',
			});
			setError(null);
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

	const handleImage = (e) => {
		setImage(e.target.files[0]);
	};

	const submitImage = async (e) => {
		e.preventDefault();
		try {
			if (!image) {
				throw new Error('Please select an image.');
			}

			const formData = new FormData();
			formData.append('image', image);
			const token = localStorage.getItem('token');

			const result = await axios.post(
				'http://localhost:3000/tour-guides/profileUpload',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setProfileData((prev) => ({
				...prev,
				image: `http://localhost:3000/images/${result.data.filename}`,
			}));

			setImageUploadError(null);
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

			const updatedProfile = response.data.tourGuideProfile || {};
			setProfileData({
				mobileNumber: updatedProfile.mobileNumber || '',
				yearsOfExperience: updatedProfile.yearsOfExperience || '',
				previousWork: updatedProfile.previousWork || '',
				image: updatedProfile.image
					? `http://localhost:3000/images/${updatedProfile.image}`
					: '',
			});
			setInitialProfileData({
				mobileNumber: updatedProfile.mobileNumber || '',
				yearsOfExperience: updatedProfile.yearsOfExperience || '',
				previousWork: updatedProfile.previousWork || '',
				image: updatedProfile.image
					? `http://localhost:3000/images/${updatedProfile.image}`
					: '',
			});
			setIsEditing(false);
			setError(null);
		} catch (error) {
			setError('Failed to update profile');
			console.error('Failed to update profile:', error);
		}
	};

	const handleCancel = () => {
		setProfileData(initialProfileData);
		setIsEditing(false);
	};
	const requestDeletion = async () => {
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

			// Fix: Add an empty object {} as the second parameter for the request body
			const response = await axios.put(
				'http://localhost:3000/tour-guides/account',
				{}, // empty request body
				config
			);

			console.log('Account deletion requested successfully', response.data);
		} catch (error) {
			console.error('Failed to delete account:', error);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-8 flex items-center justify-center'>
			<div className='max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
				<h1 className='text-3xl font-semibold text-center mb-4'>
					Tour Guide Profile
				</h1>
				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
				<div className='mb-6'>
					{profileData.image && (
						<img
							src={profileData.image}
							alt='Tour Guide'
							className='w-48 h-48 object-cover rounded-full mx-auto mb-4 border border-gray-300'
						/>
					)}
					<form
						onSubmit={submitImage}
						className='text-center'>
						<input
							type='file'
							accept='image/*'
							onChange={handleImage}
							className='border border-gray-300 rounded p-2 mt-2 mb-2 w-full'
						/>
						{imageUploadError && (
							<p className='text-red-500'>{imageUploadError}</p>
						)}
						<button
							type='submit'
							className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-2 w-full'>
							Upload Image
						</button>
					</form>
				</div>
				{!isEditing ? (
					<div className='mb-4'>
						<p className='text-lg'>
							<strong>Mobile Number:</strong>{' '}
							{profileData.mobileNumber || 'N/A'}
						</p>
						<p className='text-lg'>
							<strong>Years of Experience:</strong>{' '}
							{profileData.yearsOfExperience || 'N/A'}
						</p>
						<p className='text-lg'>
							<strong>Previous Work:</strong>{' '}
							{profileData.previousWork || 'N/A'}
						</p>
						<button
							onClick={() => setIsEditing(true)}
							className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4 w-full'>
							Edit Profile
						</button>
						<button
							onClick={requestDeletion}
							className='mt-4 w-full bg-red-600 text-white py-2 rounded-md shadow hover:bg-red-700 transition duration-200'>
							Request to Delete My Profile
						</button>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						className='space-y-4'>
						<label className='block'>
							<span>Mobile Number:</span>
							<input
								type='text'
								name='mobileNumber'
								value={profileData.mobileNumber}
								onChange={handleChange}
								required
								className='border border-gray-300 rounded p-2 w-full'
							/>
						</label>
						<label className='block'>
							<span>Years of Experience:</span>
							<input
								type='text'
								name='yearsOfExperience'
								value={profileData.yearsOfExperience}
								onChange={handleChange}
								required
								className='border border-gray-300 rounded p-2 w-full'
							/>
						</label>
						<label className='block'>
							<span>Previous Work:</span>
							<input
								type='text'
								name='previousWork'
								value={profileData.previousWork}
								onChange={handleChange}
								required
								className='border border-gray-300 rounded p-2 w-full'
							/>
						</label>
						<div className='flex space-x-4 mt-4'>
							<button
								type='button'
								onClick={handleCancel}
								className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full'>
								Cancel
							</button>
							<button
								type='submit'
								className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full'>
								Save Changes
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default TourGuideProfile;
