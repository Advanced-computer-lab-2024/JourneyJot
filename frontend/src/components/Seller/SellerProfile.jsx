/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const SellerProfile = () => {
	const [profileData, setProfileData] = useState({
		name: '',
		description: '',
		image: '',
	});
	const [initialProfileData, setInitialProfileData] = useState({
		name: '',
		description: '',
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
				'http://localhost:3000/sellers/profile',
				config
			);

			const { name, description, image } = response.data.sellerProfile || {};

			setProfileData({
				name: name || '',
				description: description || '',
				image: image ? `http://localhost:3000/images/${image}` : '',
			});
			setInitialProfileData({
				name: name || '',
				description: description || '',
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
				'http://localhost:3000/sellers/profileUpload',
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
				'http://localhost:3000/sellers/profile',
				profileData,
				config
			);

			const updatedProfile = response.data.sellerProfile || {};
			setProfileData({
				name: updatedProfile.name || '',
				description: updatedProfile.description || '',
				image: updatedProfile.image
					? `http://localhost:3000/images/${updatedProfile.image}`
					: '',
			});
			setInitialProfileData({
				name: updatedProfile.name || '',
				description: updatedProfile.description || '',
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

	return (
		<div className='max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
			<h1 className='text-3xl font-semibold text-center mb-4'>
				Seller Profile
			</h1>
			{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
			<div className='mb-6'>
				{profileData.image && (
					<img
						src={profileData.image}
						alt='Seller'
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
						<strong>Name:</strong> {profileData.name || 'N/A'}
					</p>
					<p className='text-lg'>
						<strong>Description:</strong> {profileData.description || 'N/A'}
					</p>
					<button
						onClick={() => setIsEditing(true)}
						className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4 w-full'>
						Edit Profile
					</button>
				</div>
			) : (
				<form
					onSubmit={handleSubmit}
					className='space-y-4'>
					<label className='block'>
						<span>Name:</span>
						<input
							type='text'
							name='name'
							value={profileData.name}
							onChange={handleChange}
							required
							className='border border-gray-300 rounded p-2 w-full'
						/>
					</label>
					<label className='block'>
						<span>Description:</span>
						<textarea
							name='description'
							value={profileData.description}
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
	);
};

export default SellerProfile;
