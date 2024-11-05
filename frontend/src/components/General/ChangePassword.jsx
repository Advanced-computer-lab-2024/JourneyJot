import { useState } from 'react';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();

        // Basic validation
        if (newPassword !== confirmPassword) {
            setErrorMessage('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage('Password must be at least 8 characters long');
            return;
        }

        setErrorMessage('');
        setSuccessMessage('');

        setSuccessMessage('Password changed successfully');
    };

    return (
        <div className='max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
                {/* Current Password */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-2'>Current Password</label>
                    <input
                        type='password'
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
                        required
                    />
                </div>

                {/* New Password */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-2'>New Password</label>
                    <input
                        type='password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
                        required
                    />
                </div>

                {/* Confirm New Password */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-2'>Confirm New Password</label>
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
                        required
                    />
                </div>

                {/* Error or Success Message */}
                {errorMessage && (
                    <p className='text-red-500 text-sm mb-4'>{errorMessage}</p>
                )}
                {successMessage && (
                    <p className='text-green-500 text-sm mb-4'>{successMessage}</p>
                )}

                {/* Submit Button */}
                <button
                    type='submit'
                    className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200'>
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
