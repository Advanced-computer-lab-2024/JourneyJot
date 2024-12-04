/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const AdvertiserProfile = () => {
	const [profileData, setProfileData] = useState({
		website: '',
		hotline: '',
		companyProfile: '',
		image: '',
	});
	const [initialProfileData, setInitialProfileData] = useState({
		website: '',
		hotline: '',
		companyProfile: '',
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
				'http://localhost:3000/advertisers/profile',
				config
			);

			const { website, hotline, companyProfile, image } =
				response.data.advertiserProfile || {};

			if (!website && !hotline && !companyProfile) {
				setError('Profile information is missing. Please update your profile.');
			} else {
				setProfileData({
					website: website || '',
					hotline: hotline || '',
					companyProfile: companyProfile || '',
					image: image ? `http://localhost:3000/images/${image}` : '',
				});
				setInitialProfileData({
					website: website || '',
					hotline: hotline || '',
					companyProfile: companyProfile || '',
					image: image ? `http://localhost:3000/images/${image}` : '',
				});
				setError(null);
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
				'http://localhost:3000/advertisers/profileUpload',
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
				'http://localhost:3000/advertisers/profile',
				profileData,
				config
			);

			const updatedProfile = response.data.advertiserProfile || {};
			setProfileData({
				website: updatedProfile.website || '',
				hotline: updatedProfile.hotline || '',
				companyProfile: updatedProfile.companyProfile || '',
				image: updatedProfile.image
					? `http://localhost:3000/images/${updatedProfile.image}`
					: '',
			});
			setInitialProfileData({
				website: updatedProfile.website || '',
				hotline: updatedProfile.hotline || '',
				companyProfile: updatedProfile.companyProfile || '',
				image: updatedProfile.image
					? `http://localhost:3000/images/${updatedProfile.image}`
					: '',
			});
			setIsEditing(false);
			setError(null);
			console.log('Profile updated successfully', response.data);
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
				'http://localhost:3000/advertisers/account',
				{}, // empty request body
				config
			);

			console.log('Account deletion requested successfully', response.data);
		} catch (error) {
			console.error('Failed to delete account:', error);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 flex items-center justify-center'>
			<div className='max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
				<h1 className='text-3xl font-semibold text-center mb-4'>
					Advertiser Profile
				</h1>
				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
				<div className='mb-6'>
					{profileData.image && (
						<img
							src={profileData.image}
							alt='Advertiser'
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
							<strong>Website:</strong> {profileData.website || 'N/A'}
						</p>
						<p className='text-lg'>
							<strong>Hotline:</strong> {profileData.hotline || 'N/A'}
						</p>
						<p className='text-lg'>
							<strong>Company Profile:</strong>{' '}
							{profileData.companyProfile || 'N/A'}
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
							<span>Website:</span>
							<input
								type='text'
								name='website'
								value={profileData.website}
								onChange={handleChange}
								required
								className='border border-gray-300 rounded p-2 w-full'
							/>
						</label>
						<label className='block'>
							<span>Hotline:</span>
							<input
								type='text'
								name='hotline'
								value={profileData.hotline}
								onChange={handleChange}
								required
								className='border border-gray-300 rounded p-2 w-full'
							/>
						</label>
						<label className='block'>
							<span>Company Profile:</span>
							<input
								type='text'
								name='companyProfile'
								value={profileData.companyProfile}
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

export default AdvertiserProfile;
