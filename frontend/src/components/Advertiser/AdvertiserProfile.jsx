/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';
//website, hotline, companyProfile

const AdvertiserProfile = () => {
	const [profileData, setProfileData] = useState({
		website: '',
		hotline: '',
		companyProfile: '',
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
					'http://localhost:3000/advertisers/profile',
					config
				);
				console.log('Profile data response:', response.data);

				const { website, hotline, companyProfile } =
					response.data.AdvertiserProfile || {};
				if (!website && !hotline && !companyProfile) {
					setError(
						'Profile information is missing. Please update your profile.'
					);
				} else {
					setProfileData({
						website: website || '',
						hotline: hotline || '',
						companyProfile: companyProfile || '',
					});
					setError(null);
				}
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
				'http://localhost:3000/advertisers/profile',
				profileData,
				config
			);
			const updatedProfile = response.data.advertiserProfile || {};
			setProfileData({
				website: updatedProfile.website || '',
				hotline: updatedProfile.hotline || '',
				companyProfile: updatedProfile.companyProfile || '',
			});
			setIsEditing(false);
			setError(null);
			console.log('Profile updated successfully', response.data);
		} catch (error) {
			setError('Failed to update profile');
			console.error('Failed to update profile:', error);
		}
	};

	return (
		<div className='max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg'>
			<h1 className='text-2xl font-bold text-center mb-4'>
				Advertiser Profile
			</h1>
			{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
			{!isEditing ? (
				<div className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>Profile Details</h2>
					<div className='bg-white p-4 rounded-lg shadow'>
						<p className='mb-2'>
							<strong>Website:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.website || 'N/A'}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Hotline:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.hotline || 'N/A'}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Company Profile:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.companyProfile || 'N/A'}
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
					<label className='block mb-4'>
						<span className='font-medium'>Website:</span>
						<input
							type='text'
							name='website'
							value={profileData.website}
							onChange={handleChange}
							required
							className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200'
						/>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Hotline:</span>
						<input
							type='text'
							name='hotline'
							value={profileData.hotline}
							onChange={handleChange}
							required
							className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200'
						/>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Company Profile:</span>
						<input
							type='text'
							name='companyProfile'
							value={profileData.companyProfile}
							onChange={handleChange}
							required
							className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200'
						/>
					</label>
					<div className='flex justify-between mt-4'>
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

export default AdvertiserProfile;
