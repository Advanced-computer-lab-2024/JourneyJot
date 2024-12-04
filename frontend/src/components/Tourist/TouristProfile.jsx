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
	const [success, setSuccess] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		fetchProfile();
	}, []);

	const fetchProfile = async () => {
		try {
			setError(null);
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = { headers: { Authorization: `Bearer ${token}` } };
			const response = await axios.get(
				'http://localhost:3000/tourists/profile',
				config
			);

			setProfileData({
				email: response.data.profile.email || '',
				username: response.data.profile.username || '',
				password: '',
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
			setError('Failed to fetch profile. Please try again.');
			console.error('Fetch Error:', error);
		}
	};

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
			setError(null);
			setSuccess(null);

			const token = localStorage.getItem('token');
			const config = { headers: { Authorization: `Bearer ${token}` } };
			await axios.put(
				'http://localhost:3000/tourists/profile',
				profileData,
				config
			);

			setSuccess('Profile updated successfully!');
			await fetchProfile();
			setIsEditing(false);
		} catch (error) {
			setError('Failed to update profile. Please try again.');
			console.error('Update Error:', error);
		}
	};

	const requestDeletion = async () => {
		try {
			setError(null);
			setSuccess(null);

			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please login again.');

			const config = { headers: { Authorization: `Bearer ${token}` } };
			await axios.put(
				'http://localhost:3000/tourists/deleteAccount',
				{},
				config
			);

			setSuccess('Account deletion request submitted!');
		} catch (error) {
			setError('Failed to submit deletion request. Please try again.');
			console.error('Deletion Error:', error);
		}
	};

	function calculateAge(dob) {
		const birthDate = new Date(dob);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			age--;
		}
		return age;
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center'>
			<div className='max-w-xl w-full bg-white rounded-lg shadow-xl p-6'>
				<h1 className='text-2xl font-bold text-center mb-6 text-gray-800'>
					Tourist Profile
				</h1>

				{error && (
					<p className='text-red-600 bg-red-100 p-2 rounded mb-4'>{error}</p>
				)}
				{success && (
					<p className='text-green-600 bg-green-100 p-2 rounded mb-4'>
						{success}
					</p>
				)}

				{!isEditing ? (
					<div>
						<h2 className='text-lg font-semibold mb-3'>Profile Details</h2>
						<div className='bg-gray-100 p-4 rounded-lg'>
							<p className='mb-2'>
								<strong>Email:</strong> {profileData.email || 'N/A'}
							</p>
							<p className='mb-2'>
								<strong>Username:</strong> {profileData.username || 'N/A'}
							</p>
							<p className='mb-2'>
								<strong>Mobile:</strong> {profileData.mobileNumber || 'N/A'}
							</p>
							<p className='mb-2'>
								<strong>Nationality:</strong> {profileData.nationality || 'N/A'}
							</p>
							<p className='mb-2'>
								<strong>Age:</strong>{' '}
								{profileData.dob ? calculateAge(profileData.dob) : 'N/A'}
							</p>
							<p className='mb-2'>
								<strong>Occupation:</strong> {profileData.occupation || 'N/A'}
							</p>
							<p className='mb-2'>
								<strong>Wallet Balance:</strong> ${profileData.wallet.balance}
							</p>
							<p className='mb-2'>
								<strong>Currency:</strong> {profileData.wallet.currency}
							</p>
						</div>

						<button
							className='w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600'
							onClick={() => setIsEditing(true)}>
							Edit Profile
						</button>
						<button
							className='w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-600'
							onClick={requestDeletion}>
							Request Account Deletion
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						<h2 className='text-lg font-semibold mb-4'>Edit Profile</h2>
						{/* Form Fields */}
						<label className='block mb-4'>
							<span>Email:</span>
							<input
								type='email'
								name='email'
								value={profileData.email}
								onChange={handleChange}
								className='block w-full mt-1 border-gray-300 rounded-md p-2'
								required
							/>
						</label>
						{/* Other inputs */}
						<div className='flex justify-between mt-4'>
							<button className='bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600'>
								Save
							</button>
							<button
								className='bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600'
								type='button'
								onClick={() => setIsEditing(false)}>
								Cancel
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default TouristProfile;
