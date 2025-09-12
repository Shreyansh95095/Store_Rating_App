import { useState, useEffect } from 'react';
import { logoutApi } from '../services/auth';

export default function Profile() {
    // Store owner profile data
    const [profile, setProfile] = useState({
        storeName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        description: "",
        establishedYear: "",
        website: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(profile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Password change states
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await logoutApi();
            window.location.href = '/';
        } catch (e) {
            setError(e.message || 'Failed to logout');
        } finally {
            setLoggingOut(false);
        }
    };

    // API functions
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/stores/profile', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setProfile(data.data);
                    setEditForm(data.data);
                } else {
                    setError(data.message || 'Failed to fetch profile');
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to fetch profile');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            console.log('Sending data:', editForm);

            const response = await fetch('/api/stores/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(editForm)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setProfile(editForm);
                setIsEditing(false);
                setSuccess(data.message || 'Profile saved successfully!');
                setTimeout(() => setSuccess(null), 3000);
            } else {
                // Handle validation errors
                if (data.errors && Array.isArray(data.errors)) {
                    const errorMessages = data.errors.map(error => error.msg).join(', ');
                    setError(`Validation failed: ${errorMessages}`);
                } else {
                    setError(data.message || 'Failed to save profile');
                }
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Password change functions
    const handlePasswordChange = async () => {
        try {
            setChangingPassword(true);
            setError(null);
            setSuccess(null);

            // Client-side validation
            if (!passwordForm.currentPassword.trim()) {
                setError('Current password is required');
                return;
            }
            if (!passwordForm.newPassword.trim()) {
                setError('New password is required');
                return;
            }
            if (passwordForm.newPassword.length < 6) {
                setError('New password must be at least 6 characters long');
                return;
            }
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setError('New password and confirm password do not match');
                return;
            }

            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(data.message || 'Password changed successfully!');
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordChange(false);
                setTimeout(() => setSuccess(null), 3000);
            } else {
                if (data.errors && Array.isArray(data.errors)) {
                    const errorMessages = data.errors.map(error => error.msg).join(', ');
                    setError(`Validation failed: ${errorMessages}`);
                } else {
                    setError(data.message || 'Failed to change password');
                }
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setChangingPassword(false);
        }
    };

    const handlePasswordInputChange = (field, value) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Load profile data on component mount
    useEffect(() => {
        fetchProfile();
    }, []);

    // Profile editing functions
    const handleEdit = () => {
        setEditForm(profile);
        setIsEditing(true);
    };

    const handleSave = () => {
        // Basic client-side validation
        if (!editForm.storeName.trim()) {
            setError('Store name is required');
            return;
        }
        if (!editForm.ownerName.trim()) {
            setError('Owner name is required');
            return;
        }
        if (!editForm.email.trim()) {
            setError('Email is required');
            return;
        }
        if (!editForm.phone.trim()) {
            setError('Phone number is required');
            return;
        }
        if (!editForm.address.trim()) {
            setError('Address is required');
            return;
        }

        saveProfile();
    };

    const handleCancel = () => {
        setEditForm(profile);
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <div className="bg-orange-50 min-h-screen p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-orange-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Store Profile</h1>
                        <p className="text-gray-600 mt-2">Manage your store information and settings</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${loggingOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
                        >
                            {loggingOut ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Logging out...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                                    </svg>
                                    <span>Logout</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-700">Store Information</h2>
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${saving
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600'
                                        } text-white`}
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Cancel</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile Form */}
                    <div className="space-y-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.storeName}
                                            onChange={(e) => handleInputChange('storeName', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-semibold text-lg">{profile.storeName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.ownerName}
                                            onChange={(e) => handleInputChange('ownerName', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.ownerName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={editForm.website}
                                            onChange={(e) => handleInputChange('website', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.website}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editForm.establishedYear}
                                            onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.establishedYear}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editForm.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Store Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
                            {isEditing ? (
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Tell customers about your store..."
                                />
                            ) : (
                                <p className="text-gray-900 leading-relaxed">{profile.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Security Settings</h3>
                            <button
                                onClick={() => setShowPasswordChange(!showPasswordChange)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <span>{showPasswordChange ? 'Cancel' : 'Change Password'}</span>
                            </button>
                        </div>

                        {showPasswordChange && (
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="text-md font-medium text-gray-700 mb-4">Change Your Password</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Enter your current password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Enter your new password"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Password must be at least 6 characters long and include uppercase letter and special character
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Confirm your new password"
                                        />
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={changingPassword}
                                            className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${changingPassword
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-red-500 hover:bg-red-600'
                                                } text-white`}
                                        >
                                            {changingPassword ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    <span>Changing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Change Password</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPasswordChange(false);
                                                setPasswordForm({
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                });
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Actions */}
                    {!isEditing && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Upload Logo</span>
                                </button>
                                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                    <span>Store Settings</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
