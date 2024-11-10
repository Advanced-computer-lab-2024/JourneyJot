/** @format */

import { useState, useEffect } from 'react';
import axios from 'axios';

const TouristProfile = () => {
	const [profileData, setProfileData] = useState({
		email: '',
		username: '',
		password: '',
		mobileNumber: '',
		nationality: '',
		dob: '',
		occupation: '',
		wallet: {
			balance: 0,
			currency: 'USD',
		},
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
					'http://localhost:3000/tourists/profile',
					config
				);
				console.log('Profile data response:', response.data);

				setProfileData({
					email: response.data.profile.email || '',
					username: response.data.profile.username || '',
					password: '', // Keep password field empty by default
					mobileNumber: response.data.profile.mobileNumber || '',
					nationality: response.data.profile.nationality || '',
					dob: response.data.profile.dob || '',
					occupation: response.data.profile.occupation || '',
					wallet: {
						balance: response.data.profile.wallet?.balance || 0,
						currency: response.data.profile.wallet?.currency || 'USD',
					},
				});
			} catch (error) {
				setError('Failed to fetch profile');
				console.error('Failed to fetch profile:', error);
			}
		};

		fetchProfile();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name.startsWith('wallet.')) {
			const walletField = name.split('.')[1];
			setProfileData((prevData) => ({
				...prevData,
				wallet: { ...prevData.wallet, [walletField]: value },
			}));
		} else {
			setProfileData({ ...profileData, [name]: value });
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
				'http://localhost:3000/tourists/profile',
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
	const handleDeleteAccount = async () => {
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

			// Use POST instead of DELETE
			const response = await axios.post(
				'http://localhost:3000/tourists/deleteAccount',
				{}, // Pass an empty object as data since it's a POST request
				config
			);

			alert(response.data.message); // Display success message
			console.log('Account deletion response:', response.data);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || 'Failed to delete account.';
			setError(errorMessage);
			console.error('Error deleting account:', error);
		}
	};


	return (
		<div className='max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg'>
			<h1 className='text-2xl font-bold text-center mb-4'>Tourist Profile</h1>
			{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
			{!isEditing ? (
				<div className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>Profile Details</h2>
					<div className='bg-white p-4 rounded-lg shadow'>
						<p className='mb-2'>
							<strong>Email:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.email || 'N/A'}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Username:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.username || 'N/A'}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Mobile Number:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.mobileNumber || 'N/A'}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Nationality:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.nationality || 'N/A'}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Date of Birth:</strong>{' '}
							<span className='text-gray-700'>{profileData.dob || 'N/A'}</span>
						</p>
						<p className='mb-2'>
							<strong>Occupation:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.occupation || 'N/A'}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Wallet Balance:</strong>{' '}
							<span className='text-gray-700'>
								${profileData.wallet.balance || 0}
							</span>
						</p>
						<p className='mb-2'>
							<strong>Currency:</strong>{' '}
							<span className='text-gray-700'>
								{profileData.wallet.currency || 'USD'}
							</span>
						</p>
					</div>
					<button
						className='mt-4 w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition duration-200'
						onClick={() => setIsEditing(true)}
					>
						Edit Profile
					</button>
					<button
						className='mt-4 w-full bg-red-600 text-white py-2 rounded-md shadow hover:bg-red-700 transition duration-200'
						onClick={handleDeleteAccount}
					>
						Request to Delete My Profile
					</button>
				</div>
			) : (
				<form
					className='bg-white p-6 rounded-lg shadow'
					onSubmit={handleSubmit}
				>
					<h2 className='text-xl font-semibold mb-4'>Edit Profile</h2>
					<label className='block mb-4'>
						<span className='font-medium'>Username:</span>
						<input
							type='text'
							name='username'
							value={profileData.username}
							disabled
							className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						/>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Email:</span>
						<input
							type='email'
							name='email'
							value={profileData.email}
							onChange={handleChange}
							required
							className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						/>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Password:</span>
						<input
							type='password'
							name='password'
							value={profileData.password}
							onChange={handleChange}
							disabled
							className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						/>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Mobile Number:</span>
						<input
							type='text'
							name='mobileNumber'
							value={profileData.mobileNumber}
							onChange={handleChange}
							required
							className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						/>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Nationality:</span>
						<input
							type='text'
							name='nationality'
							value={profileData.nationality}
							onChange={handleChange}
							required
							className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						/>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Date of Birth:</span>
						<input
							type='date'
							name='dob'
							value={profileData.dob}
							onChange={handleChange}
							disabled
							className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						/>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Occupation:</span>
						<select
							name='occupation'
							value={profileData.occupation}
							onChange={handleChange}
							required
							className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						>
							<option value='Job'>Job</option>
							<option value='Student'>Student</option>
						</select>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Wallet Balance:</span>
						<input
							type='number'
							name='wallet.balance'
							value={profileData.wallet.balance}
							onChange={handleChange}
							required
							className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						/>
					</label>
					<label className='block mb-4'>
						<span className='font-medium'>Currency:</span>
						<input
							type='text'
							name='wallet.currency'
							value={profileData.wallet.currency}
							onChange={handleChange}
							className='mt-1 block w-full border border-gray-300 rounded-md p-2'
						/>
					</label>
					<div className='flex justify-between mt-4'>
						<button
							className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200'
							type='submit'
						>
							Update Profile
						</button>
						<button
							className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200'
							type='button'
							onClick={() => setIsEditing(false)}
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default TouristProfile;
