import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { userAPI } from '../utils/api.jsx';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    university: '',
    graduationYear: '',
    skills: '',
    github: '',
    linkedin: '',
    website: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        bio: user.bio || '',
        university: user.university || '',
        graduationYear: user.graduationYear || '',
        skills: user.skills ? user.skills.join(', ') : '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        website: user.website || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileForm.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (profileForm.github && !isValidUrl(profileForm.github)) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }

    if (profileForm.linkedin && !isValidUrl(profileForm.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    if (profileForm.website && !isValidUrl(profileForm.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = {
        ...profileForm,
        skills: profileForm.skills ? profileForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : []
      };

      await updateProfile(formData);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageUploading(true);

    try {
      const response = await userAPI.uploadImage(file);
      await updateProfile({ profilePicture: response.data.imageUrl });
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: '👤' },
    { id: 'password', name: 'Change Password', icon: '🔒' },
    { id: 'stats', name: 'Statistics', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">👤</div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
          </div>
          <p className="text-gray-600">
            Manage your profile, update information, and track your progress.
          </p>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="card-body">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                  <div className="w-6 h-6 text-gray-600">
                    {imageUploading ? (
                      <div className="spinner w-4 h-4"></div>
                    ) : (
                      '📷'
                    )}
                  </div>
                </label>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card-body">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className={`input ${errors.name ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-error-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                        University
                      </label>
                      <input
                        id="university"
                        name="university"
                        type="text"
                        value={profileForm.university}
                        onChange={handleProfileChange}
                        className="input"
                        placeholder="Enter your university"
                      />
                    </div>

                    <div>
                      <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
                        Graduation Year
                      </label>
                      <input
                        id="graduationYear"
                        name="graduationYear"
                        type="number"
                        min="2000"
                        max="2030"
                        value={profileForm.graduationYear}
                        onChange={handleProfileChange}
                        className="input"
                        placeholder="Enter graduation year"
                      />
                    </div>

                    <div>
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <input
                        id="skills"
                        name="skills"
                        type="text"
                        value={profileForm.skills}
                        onChange={handleProfileChange}
                        className="input"
                        placeholder="JavaScript, Python, React, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="4"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      className="textarea"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub URL
                      </label>
                      <input
                        id="github"
                        name="github"
                        type="url"
                        value={profileForm.github}
                        onChange={handleProfileChange}
                        className={`input ${errors.github ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                        placeholder="https://github.com/username"
                      />
                      {errors.github && (
                        <p className="mt-1 text-sm text-error-600">{errors.github}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        id="linkedin"
                        name="linkedin"
                        type="url"
                        value={profileForm.linkedin}
                        onChange={handleProfileChange}
                        className={`input ${errors.linkedin ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                        placeholder="https://linkedin.com/in/username"
                      />
                      {errors.linkedin && (
                        <p className="mt-1 text-sm text-error-600">{errors.linkedin}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        id="website"
                        name="website"
                        type="url"
                        value={profileForm.website}
                        onChange={handleProfileChange}
                        className={`input ${errors.website ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                        placeholder="https://yourwebsite.com"
                      />
                      {errors.website && (
                        <p className="mt-1 text-sm text-error-600">{errors.website}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="spinner mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        'Update Profile'
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className={`input ${errors.currentPassword ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Enter your current password"
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-error-600">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password *
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={`input ${errors.newPassword ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Enter your new password"
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-error-600">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`input ${errors.confirmPassword ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Confirm your new password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-error-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="spinner mr-2"></div>
                          Changing Password...
                        </div>
                      ) : (
                        'Change Password'
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {user?.loginCount || 1}
                    </div>
                    <div className="text-sm text-blue-700">Total Logins</div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {user?.toolsUsed || 0}
                    </div>
                    <div className="text-sm text-green-700">Tools Used</div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {user?.profileCompletion || 50}%
                    </div>
                    <div className="text-sm text-purple-700">Profile Complete</div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-sm text-orange-700">Last Login</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 